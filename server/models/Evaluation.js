module.exports = (sequelize, DataTypes) => {
  const Evaluation = sequelize.define('Evaluation', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    businessPlanId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    evaluationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    evaluatorId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    criteria: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    overallScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    nextSteps: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  Evaluation.associate = (models) => {
    Evaluation.belongsTo(models.BusinessPlan, {
      foreignKey: 'businessPlanId',
      as: 'businessPlan'
    });
    
    Evaluation.belongsTo(models.User, {
      foreignKey: 'evaluatorId',
      as: 'evaluator'
    });
  };

  return Evaluation;
};