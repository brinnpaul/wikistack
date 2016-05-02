var Sequelize = require('sequelize');
var db = new Sequelize('wikistack', 'bpr', 'sunshine', {
  dialect: 'postgres',
  port: 5432
});


var Page = db.define('page', {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        urlTitle: {
            type: Sequelize.STRING,
            allowNull: false
        },
        content: {
            type: Sequelize.STRING,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('open', 'closed')
        },
        date: {
            type: Sequelize.DATE
        }
    },
        {

           getterMethods: {
            route: function() { return '/wiki/' + this.urlTitle }
        }
    });

function urlName(str){
    if(str){
        var a = str.replace(/[^a-zA-Z ]/g, "");
        return a.split(' ').join('_');
    } else {
        // Generates random 5 letter string
        return Math.random().toString(36).substring(2, 7);
    }
}

Page.hook('beforeValidate', function(page, options){
    page.urlTitle = urlName(page.title);
});

var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        isEmail: true,
        allowNull: false
    }
});

Page.belongsTo(User, { as: 'author' });

module.exports = {
  Page: Page,
  User: User
};
