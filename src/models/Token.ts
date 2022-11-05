import { Schema } from "mongoose";
import { db } from "@models/db";

let TokenSchema = new Schema({
  token: String,
  created_at: Date,
  expired_at: Date,
});

export interface TokenModel extends Document {
  _id: string;
  token: string;
  created_at: Date;
  expired_at: Date;
}

export let Token = db.model("token", TokenSchema);
