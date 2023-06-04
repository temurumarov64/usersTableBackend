class Authorization {
  constructor(db) {
    this.db = db;
  }

  async createUser(name, email, password, callback) {
    await this.db.query(
      "INSERT INTO users (name, email, password, status) VALUES (?, ?, ?, 1)",
      [name, email, password],
      callback
    );
  }

  async findUserByEmail(email, callback) {
    await this.db.query(
      "SELECT email, status FROM users WHERE email = ?",
      [email],
      callback
    );
  }

  async updateLastSeen(data, email, callback) {
    await this.db.query(
      "UPDATE users SET last_seen_date = ? WHERE email = ?",
      [data, email],
      callback
    );
  }

  async getList(callback) {
    await this.db.query(
      "SELECT id, name, email, registr_date, last_seen_date, status FROM users",
      callback
    );
  }

  async updateUserStatus(id, status, callback) {
    await this.db.query(
      "UPDATE users SET status = ? WHERE id = ?",
      [status, id],
      callback
    );
  }

  async deleteUserApi(id, callback) {
    await this.db.query("DELETE FROM users WHERE id = ?", [id], callback);
  }
}

module.exports = Authorization;
