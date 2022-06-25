const Sequelize = require('sequelize');
const connection = require('../databases/database');
const Category = require('../categories/Category');

const Article = connection.define('Articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

// representando relacionamentos 1 - N
Category.hasMany(Article) //Uma Category tem N cartigos

// representando relacionamento 1 - 1
Article.belongsTo(Category); //Um Article pertence à uma Category 

// Article.sync({ force: true })
//     .then(() => {
//         console.log('Tabela "Article" recriada com sucesso!')
//     })

module.exports = Article;