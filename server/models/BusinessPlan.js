module.exports = (sequelize, DataTypes) => {
  const BusinessPlan = sequelize.define('BusinessPlan', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    partnerId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'active', 'completed', 'archived'),
      defaultValue: 'draft'
    },
    // Sales Metrics
    outboundACV: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    inboundACV: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    outboundSQLToWinRatio: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    inboundSQLToWinRatio: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    outboundTALToSQLRatio: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    inboundTALToSQLRatio: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    outboundCommissionRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    inboundCommissionRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    // Contract Terms
    contractTerms: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    exitClauses: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    // KPIs
    kpis: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  BusinessPlan.associate = (models) => {
    BusinessPlan.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company'
    });
    
    BusinessPlan.belongsTo(models.Company, {
      foreignKey: 'partnerId',
      as: 'partner'
    });
    
    BusinessPlan.hasMany(models.Bookkeeping, {
      foreignKey: 'businessPlanId',
      as: 'bookkeepingEntries'
    });
    
    BusinessPlan.hasMany(models.Evaluation, {
      foreignKey: 'businessPlanId',
      as: 'evaluations'
    });
  };

  return BusinessPlan;
};