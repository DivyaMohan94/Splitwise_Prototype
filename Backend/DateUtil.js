function utcdate() {
  const date = new Date();
  const nowUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

  return new Date(nowUTC);
}

module.exports = utcdate;
