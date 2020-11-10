module.exports = {
	httpServer: {
		port: process.env.NODE_PORT || 3000
	},	
	paths: {
		static: './public',
		routes: './routes'
	}
};
