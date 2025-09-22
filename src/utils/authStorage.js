import Cookies from "js-cookie";

const COOKIE_TOKEN_KEY = "pt_access_token";
const COOKIE_USER_KEY = "pt_user";
const LOCAL_STORAGE_TOKEN_KEY = "authToken";
const LOCAL_STORAGE_USER_KEY = "user";
const COOKIE_EXPIRES_DAYS = 7;

const cookieOptions = {
  expires: COOKIE_EXPIRES_DAYS,
  sameSite: "Lax",
  secure: true, // В dev-окружении на http можно временно отключить, но в проде оставляем включённым.
  path: "/",
};
// HttpOnly нельзя выставить на клиенте: для максимальной безопасности сервер должен устанавливать такие cookie сам.

export const AUTH_STORAGE_EVENTS = {
  CHANGE: "auth-storage:change",
  LOGOUT: "auth-storage:logout",
};

export const AUTH_STORAGE_KEYS = {
  COOKIE_TOKEN_KEY,
  COOKIE_USER_KEY,
  LOCAL_STORAGE_TOKEN_KEY,
  LOCAL_STORAGE_USER_KEY,
};

const isBrowser = typeof window !== "undefined";

const getLocalStorage = () => {
  if (!isBrowser) {
    return null;
  }

  try {
    return window.localStorage;
  } catch (error) {
    console.warn("localStorage недоступен:", error);
    return null;
  }
};

const persistToLocalStorage = (key, value) => {
  const storage = getLocalStorage();
  if (!storage) return;

  try {
    if (value === null || value === undefined) {
      storage.removeItem(key);
    } else {
      storage.setItem(key, value);
    }
  } catch (error) {
    console.warn(`Не удалось сохранить ${key} в localStorage:`, error);
  }
};

const readFromLocalStorage = (key) => {
  const storage = getLocalStorage();
  if (!storage) return null;

  try {
    return storage.getItem(key);
  } catch (error) {
    console.warn(`Не удалось прочитать ${key} из localStorage:`, error);
    return null;
  }
};

const removeFromLocalStorage = (key) => {
  const storage = getLocalStorage();
  if (!storage) return;

  try {
    storage.removeItem(key);
  } catch (error) {
    console.warn(`Не удалось удалить ${key} из localStorage:`, error);
  }
};

const emitEvent = (type) => {
  if (!isBrowser) return;
  window.dispatchEvent(new CustomEvent(type));
};

const emitChange = () => emitEvent(AUTH_STORAGE_EVENTS.CHANGE);
const emitLogout = () => emitEvent(AUTH_STORAGE_EVENTS.LOGOUT);

const toRoleName = (role) => {
  if (!role) return null;
  if (typeof role === "string") return role;
  if (typeof role === "object") {
    if (typeof role.name === "string") return role.name;
    if (typeof role.slug === "string") return role.slug;
  }
  return null;
};

const sanitizeUserForStorage = (user) => {
  if (!user || typeof user !== "object") {
    return null;
  }

  const sanitized = {};

  if (user.id !== undefined) sanitized.id = user.id;
  if (user.email !== undefined) sanitized.email = user.email;
  if (user.first_name !== undefined) sanitized.first_name = user.first_name;
  if (user.last_name !== undefined) sanitized.last_name = user.last_name;

  const roles = Array.isArray(user.roles)
    ? user.roles
    : user.roles
    ? [user.roles]
    : [];
  const normalizedRoles = roles.map(toRoleName).filter(Boolean);

  if (
    user.is_admin === true &&
    !normalizedRoles.some(
      (role) => typeof role === 'string' && role.toLowerCase() === 'admin'
    )
  ) {
    normalizedRoles.push('admin');
  }

  sanitized.roles = normalizedRoles;

  if (user.avatar !== undefined) sanitized.avatar = user.avatar;

  return sanitized;
};

const addDerivedFields = (user) => {
  if (!user) return null;

  const roles = Array.isArray(user.roles) ? user.roles.map(toRoleName).filter(Boolean) : [];
  const isAdminFromRoles = roles.some((role) => {
    if (typeof role !== "string") return false;
    const normalized = role.toLowerCase();
    return normalized === "admin" || normalized === "админ";
  });

  return {
    ...user,
    roles,
    is_admin:
      typeof user.is_admin === "boolean" ? user.is_admin : isAdminFromRoles,
  };
};

const getToken = () => {
  const cookieToken = Cookies.get(COOKIE_TOKEN_KEY);
  if (cookieToken) {
    persistToLocalStorage(LOCAL_STORAGE_TOKEN_KEY, cookieToken);
    return cookieToken;
  }

  const fallback = readFromLocalStorage(LOCAL_STORAGE_TOKEN_KEY);
  if (fallback) {
    Cookies.set(COOKIE_TOKEN_KEY, fallback, cookieOptions);
    return fallback;
  }

  return null;
};

const getUser = () => {
  let raw = Cookies.get(COOKIE_USER_KEY);

  if (!raw) {
    raw = readFromLocalStorage(LOCAL_STORAGE_USER_KEY);
    if (raw) {
      Cookies.set(COOKIE_USER_KEY, raw, cookieOptions);
    }
  }

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    const sanitized = sanitizeUserForStorage(parsed);
    if (!sanitized) {
      return null;
    }

    const serialized = JSON.stringify(sanitized);
    if (serialized !== raw) {
      Cookies.set(COOKIE_USER_KEY, serialized, cookieOptions);
      persistToLocalStorage(LOCAL_STORAGE_USER_KEY, serialized);
    }

    return addDerivedFields(sanitized);
  } catch (error) {
    console.warn("Не удалось распарсить данные пользователя из хранилища", error);
    removeFromLocalStorage(LOCAL_STORAGE_USER_KEY);
    Cookies.remove(COOKIE_USER_KEY, { path: cookieOptions.path });
    return null;
  }
};

const removeToken = () => {
  Cookies.remove(COOKIE_TOKEN_KEY, { path: cookieOptions.path });
  removeFromLocalStorage(LOCAL_STORAGE_TOKEN_KEY);
};

const removeUser = () => {
  Cookies.remove(COOKIE_USER_KEY, { path: cookieOptions.path });
  removeFromLocalStorage(LOCAL_STORAGE_USER_KEY);
};

const setToken = (token, { emit = true } = {}) => {
  if (!token) {
    removeToken();
    if (emit) emitChange();
    return null;
  }

  Cookies.set(COOKIE_TOKEN_KEY, token, cookieOptions);
  persistToLocalStorage(LOCAL_STORAGE_TOKEN_KEY, token);

  if (emit) emitChange();
  return token;
};

const setUser = (user, { emit = true } = {}) => {
  if (!user) {
    removeUser();
    if (emit) emitChange();
    return null;
  }

  const sanitized = sanitizeUserForStorage(user);
  if (!sanitized) {
    removeUser();
    if (emit) emitChange();
    return null;
  }

  const serialized = JSON.stringify(sanitized);
  if (serialized.length > 4000) {
    console.warn(
      "Сериализованный пользователь превышает 4KB, часть данных может быть усечена браузером"
    );
  }

  Cookies.set(COOKIE_USER_KEY, serialized, cookieOptions);
  persistToLocalStorage(LOCAL_STORAGE_USER_KEY, serialized);

  const normalized = addDerivedFields(sanitized);

  if (emit) emitChange();
  return normalized;
};

const setAuth = ({ token, user }) => {
  const normalizedUser = setUser(user, { emit: false });
  const normalizedToken = setToken(token, { emit: false });
  emitChange();
  return { token: normalizedToken, user: normalizedUser };
};

const getAuth = () => ({ token: getToken(), user: getUser() });

const clearAuth = ({ emit = true } = {}) => {
  removeToken();
  removeUser();
  if (emit) {
    emitChange();
    emitLogout();
  }
};

const authStorage = {
  COOKIE_EXPIRES_DAYS,
  events: AUTH_STORAGE_EVENTS,
  keys: AUTH_STORAGE_KEYS,
  getToken,
  setToken,
  removeToken,
  getUser,
  setUser,
  removeUser,
  getAuth,
  setAuth,
  clearAuth,
};

export default authStorage;
