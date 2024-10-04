import { IOrderRepository } from '../db/interfaces/IOrderRepository';
//import { MongoOrderRepository } from '../db/mongodb/repositories/MongoOrderRepository';
//import { FirebaseOrderRepository } from '../db/firebase/repositories/FirebaseOrderRepository';
import { MySQLOrderRepository } from '../db/mysql/repositories/MySQLOrderRepository';
//import { SupabaseOrderRepository } from '../db/supabase/repositories/SupabaseOrderRepository';
//import { FlaskOrderRepository } from '../db/flask/repositories/FlaskOrderRepository';
import { JsonOrderRepository } from '../db/json/repositories/JsonOrderRepository';

export class OrderRepositoryFactory {
  static getRepository(): IOrderRepository {
    const dbType = process.env.DB_TYPE || 'json';

    switch (dbType) {
      case 'firebase':
        //return new FirebaseOrderRepository();
        throw new Error('Firebase repository not implemented');
      case 'mysql':
        return new MySQLOrderRepository();
      case 'supabase':
        //return new SupabaseOrderRepository();
        throw new Error('Supabase repository not implemented');
      case 'flask':
        //return new FlaskOrderRepository();
        throw new Error('Flask repository not implemented');
      case 'json':
        return new JsonOrderRepository();
      case 'mongodb':
        //return new MongoOrderRepository();
        throw new Error('MongoDB repository not implemented');
      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }
  }
}
