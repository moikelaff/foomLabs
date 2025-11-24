module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      {
        name: 'Icy Mint',
        sku: 'ICYMINT',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Choco Fudge',
        sku: 'CHOCOFUDGE',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Vanilla Dream',
        sku: 'VANILLADREAM',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Strawberry Blast',
        sku: 'STRAWBLAST',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Caramel Swirl',
        sku: 'CARAMELSWIRL',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
