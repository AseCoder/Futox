module.exports = {
  run: (id) => {
    return new Promise(async (res, rej) => {
      const user = await global.Client.users.fetch(id, false).catch(e => rej(e));
      res(user);
    });
  },
};