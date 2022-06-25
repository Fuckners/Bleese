const express = require('express');
const router = express.Router();
const slugify = require('slugify')
const Article = require('./Article')
const Category = require('../categories/Category')
const adminAuth = require('../middlewares/adminAuth')

router.get('/articles/page/:nump', (req, res) => {
    const pageNum = req.params.nump
    if (pageNum <= 0 || isNaN(pageNum)) {
        res.redirect('/articles/page/1')
    } else {
        const limit = 4
        const offset = (pageNum - 1) * limit

        Article.findAndCountAll({
            limit, // numeros de resultados
            offset, // indice de inicio
            order: [
                ['id', 'DESC']
            ]
        })
            .then((articles) => {
                Category.findAll()
                    .then((categories) => {
                        const page = {
                            next: offset + limit < articles.count ? true : false,
                            pagAtual: +pageNum
                        }
                        if (articles.rows.length == 0) {
                            let lastPage = articles.count / limit
                            res.redirect('/articles/page/' + Math.ceil(lastPage))
                        } else {
                            res.render('pages/page', { articles, page, categories });
                        }
                    })
            })
    }
})

router.get('/admin/articles', adminAuth , (req, res) => {
    Article.findAll({
        include: [
            { model: Category }
        ]
    }).then((articles) => {
        res.render('admin/articles/index', { articles })
    })
});

router.get('/articles/:slug', (req, res) => {
    const slug = req.params.slug
    Article.findOne({
        where: { slug },
        include: {
            model: Category
        }
    })
        .then((article) => {
            if (article) {
                Category.findAll()
                .then((categories) => {
                    res.render('pages/article', { article, categories })
                })
            } else {
                console.log('Artigo não encontrado');
                res.redirect('/')
            }
        })
        .catch((error) => {
            console.log(error)
            res.redirect('/')
        })
})

router.get('/admin/articles/new', adminAuth , (req, res) => {
    Category.findAll()
        .then((categories) => {
            res.render('admin/articles/news', { categories });
        })
});

router.post('/articles/save', (req, res) => {
    const title = req.body.title
    const body = req.body.body
    const category = req.body.category

    Article.create({
        title: title.trim(),
        slug: slugify(title),
        body: body,
        CategoryId: category
    })
        .then(() => {
            console.log('Artigo cadastrado com sucesso!')
            res.redirect('/admin/articles')
        })
        .catch((error) => {
            console.log(error)
        })
})

router.get('/admin/articles/edit/:id', adminAuth , (req, res) => {
    const id = req.params.id
    if (isNaN(id)) {
        res.redirect('admin/articles')
    } else {
        Article.findByPk(id)
            .then((article) => {
                if (article) {
                    Category.findAll()
                        .then((categories) => {
                            res.render('admin/articles/edit', { article, categories })
                        })
                } else {
                    res.redirect('/admin/articles')
                }
            })
    }
})

router.post('/articles/update', (req, res) => {
    const id = req.body.id
    const title = req.body.title
    const body = req.body.body
    const CategoryId = req.body.category

    Article.update({
        id,
        title,
        slug: slugify(title),
        body,
        CategoryId
    }, { where: { id } })
        .then(() => {
            res.redirect('/admin/articles')
        })
})

router.post('/admin/articles/del', adminAuth , (req, res) => {
    const id = req.body.id
    if (!id || !isNaN(id)) {
        Article.destroy({
            where: { id }
        })
            .then(() => {
                console.log('Artigo apagado com sucesso!')
            })
            .catch((error) => {
                console.log('Não foi possivel deletar o artigo');
            })
    }
    res.redirect('/admin/articles')
})

module.exports = router;