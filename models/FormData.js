const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
});

const FormData = sequelize.define('FormData', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currentPosition: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currentLength: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  currentTechnologies: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  github: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  portfolio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  linkedin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobileNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  workHistory: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  educationHistory: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  projectHistory: {
    type: DataTypes.JSON,
    allowNull: false,
  },
}, {
  tableName: 'form_data',
});

module.exports = FormData;
