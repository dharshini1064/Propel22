module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true
    },
    size: {
      type: DataTypes.ENUM('small', 'medium', 'large', 'enterprise'),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isPartner: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: true
  });

  Company.associate = (models) => {
    Company.hasMany(models.User, {
      foreignKey: 'companyId',
      as: 'users'
    });
    
    Company.belongsToMany(models.Company, {
      through: 'Partnerships',
      as: 'partners',
      foreignKey: 'companyId',
      otherKey: 'partnerId'
    });
    
    Company.hasMany(models.BusinessPlan, {
      foreignKey: 'companyId',
      as: 'businessPlans'
    });
  };

  return Company;
};