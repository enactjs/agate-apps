const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',

	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},

	// SQLite only
	storage: './db.sqlite',

	// http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
	operatorsAliases: false
});

const Item = sequelize.define('item', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	type: Sequelize.STRING,
	title: Sequelize.STRING,
	url: Sequelize.STRING
});

const Screen = sequelize.define('screen', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	name: Sequelize.STRING
	// last playing
});

const ScreenItems = sequelize.define('screenItems', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	}
	// Playing state, playing time
});

Item.belongsToMany(Screen, {through: 'ScreenItems'});
Screen.belongsToMany(Item, {through: 'ScreenItems'});

function initDB () {
	console.log('initDB');
	return sequelize.sync();
}

function saveItems (request) {
	return Item.create({
		type: request.type,
		title: request.title,
		url: request.url
	});
}

module.exports = {saveItems, initDB};
