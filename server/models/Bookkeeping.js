module.exports = (sequelize, DataTypes) => {
  const Bookkeeping = sequelize.define('Bookkeeping', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    businessPlanId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    month: {
      type: DataTypes.DATE,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subcategory: {
      type: DataTypes.STRING,
      allowNull: true
    },
    plannedAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    actualAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  Bookkeeping.associate = (models) => {
    Bookkeeping.belongsTo(models.BusinessPlan, {
      foreignKey: 'businessPlanId',
      as: 'businessPlan'
    });
  };

  return Bookkeeping;
};