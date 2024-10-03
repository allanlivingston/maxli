import { IOrderRepository } from '../db/interfaces/IOrderRepository';
//import { MongoOrderRepository } from '../db/mongodb/repositories/MongoOrderRepository';
//import { FirebaseOrderRepository } from '../db/firebase/repositories/FirebaseOrderRepository';
import { MySQLOrderRepository } from '../db/mysql/repositories/MySQLOrderRepository';
//import { SupabaseOrderRepository } from '../db/supabase/repositories/SupabaseOrderRepository';
//import { FlaskOrderRepository } from '../db/flask/repositories/FlaskOrderRepository';
import { JsonOrderRepository } from '../db/json/repositories/JsonOrderRepository';

export class OrderRepositoryFactory {
  static getRepository(): IOrderRepository {
    const dbType = process.env.DB_TYPE || 'mongodb';

    switch (dbType) {
      case 'firebase':
        //return new FirebaseOrderRepository();
      case 'mysql':
        return new MySQLOrderRepository();
      case 'supabase':
        //return new SupabaseOrderRepository();
      case 'flask':
        //return new FlaskOrderRepository();
      case 'json':
        return new JsonOrderRepository();
      case 'mongodb':
      default:
        //return new MongoOrderRepository();
    }
  }
}
