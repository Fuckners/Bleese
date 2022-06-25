const Sequelize = require('sequelize');
const connection = require('../databases/database');

const Category = connection.define('Categories', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Category.sync({ force: true })
//     .then(() => {
//         console.log('Tabela "Category" recriada com sucesso!')
//     })

module.exports = Category;