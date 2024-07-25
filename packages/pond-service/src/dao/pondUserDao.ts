interface PondUserColumns {
  id?: number;
  email?: string;
  google_id?: string;
  username?: string;
  exp?: number;
  location?: string;
  cookie?: string;
  password_hash?: string;
  is_account?: boolean;
}

const defaultReturnColumns = [
  "id",
  "username",
  "exp",
  "location",
  "is_account",
];

class PondUserDao {
  // Knex db instance
  readonly db: any;

  constructor(db: any) {
    this.db = db;
  }

  async getPondUser(key: PondUserColumns) {
    const pondUser = await this.db("pond_user")
      .select(defaultReturnColumns)
      .where(key)
      .first();
    return pondUser;
  }

  async getTopPondUsers(column: string, order: "asc" | "desc", limit: number) {
    const pondUsers = await this.db("pond_user")
      .select(defaultReturnColumns)
      .orderBy(column, order)
      .limit(limit);
    return pondUsers;
  }

  async insertPondUser(columns: PondUserColumns) {
    const pondUser = await this.db("pond_user")
      .returning(defaultReturnColumns)
      .insert(columns);
    return pondUser[0];
  }

  async updatePondUser(key: PondUserColumns, columns: PondUserColumns) {
    const pondUser = await this.db("pond_user")
      .returning(defaultReturnColumns)
      .where(key)
      .update(columns);
    return pondUser[0];
  }

  async incrementPondUserExp(id: number, inc: number) {
    const pondUser = await this.db("pond_user")
      .where({
        id,
      })
      .increment("exp", inc)
      .returning(defaultReturnColumns);
    return pondUser[0];
  }

  async getPondUserPasswordHash(username: string): Promise<string> {
    const pondUser = await this.db("pond_user")
      .select(["password_hash"])
      .where({ username })
      .first();
    return pondUser.password_hash;
  }
}

export default PondUserDao;
