// models/User.js
/*
create table messaging.users
(
    id             int auto_increment primary key,
    username       varchar(50)                         not null,
    email          varchar(100)                        not null,
    password_hash  varchar(255)                        not null,
    first_name     varchar(50)                         not null,
    last_name      varchar(50)                         not null,
    device_address varchar(50)                         null,
    date_created   timestamp default CURRENT_TIMESTAMP null,
    last_login     timestamp                           null,
    constraint email
        unique (email),
    constraint username
        unique (username)
);
*/

import { DataTypes, Model } from "sequelize";
import sequelize from '#config/database.js';
import bcrypt from 'bcrypt';

class User extends Model {
  checkPassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  }
};

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      field: 'id',
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'username',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'email',
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.VIRTUAL,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash',
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'last_name',
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`;
      },
      set(value) {
        throw new Error('Do not try to set the `fullName` value!');
      },
    },
    deviceAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'device_address',
      validate: {
        isIP: true,
      },
    },
    dateCreated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      field: 'created_at',
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_seen',
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'User',
    tableName: 'users',
  }
);

User.associate = (models) => {
  this.hasMany(models.Message, {
    as: 'message',
    foreignKey: { name: 'senderId', type: DataTypes.INTEGER },
    foreignKey: { name: 'recipientId', type: DataTypes.INTEGER },
  });
}

User.addHook("beforeSave", async (user) => {
  if (user.password) {
    user.password_hash = await bcrypt.hash(user.password, 8);
  }
});

export default User;
