import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import config from 'config';
import logger from '../utils/logger';
import Product from '../models/product.model';
import Session from '../models/session.model';
import User from '../models/user.models';

const dbUri = config.get<string>('dbUri');

mongoose
  .connect(dbUri)
  .then(() => {
    logger.info('DB connected!');
  })
  .catch(() => logger.error('Could not connect to DB.'));

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, 'utf-8')
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

const importData = async () => {
  try {
    await Product.create(products);
    await User.create(users);
    logger.info('Data imported to DB.');
  } catch (err: any) {
    console.log(err);
  }

  process.exit();
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    await Session.deleteMany();
    await User.deleteMany();
    logger.info('Data deleted from DB.');
  } catch (err: any) {
    console.log(err);
  }

  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
