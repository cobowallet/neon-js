export function setAll(lvl) { }
const fackLoger = {
    info: (...args) => { },
    warn: (...args) => { },
    debug: (...args) => { },
    error: (...args) => { },
    default: (...args) => { }
};
const fn = (level, name, timestamp) => {
    const ts = timestamp ? timestamp : new Date().toUTCString();
    level = level.toUpperCase();
    return `[${ts}] (${name}) ${level}: `;
};
export default (label) => {
    return fackLoger;
};
export const logger = fackLoger;
//# sourceMappingURL=logging.js.map