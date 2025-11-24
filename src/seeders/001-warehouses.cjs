module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('warehouses', [
      {
        name: 'Jakarta Warehouse',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Surabaya Warehouse',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Bandung Warehouse',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('warehouses', null, {});
  }
};
