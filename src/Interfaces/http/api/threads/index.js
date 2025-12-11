/* eslint-disable no-param-reassign */
const routes = require('./routes');
const ThreadsHandler = require('./handler');

module.exports = {
  name: 'threads',
  register: async (server, { container }) => {
    // store container for routes that use server.app.container (delete reply route above)
    server.app.container = container;
    const threadsHandler = new ThreadsHandler(container);
    server.route(routes(threadsHandler));
  },
};
