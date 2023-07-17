# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- Index: [/products](http://localhost:3000/products) [GET]
- Show: [/products/:id](http://localhost:3000/products/:id) [GET]
- Create [token required]: [/products](http://localhost:3000/products) [POST]
- Destroy [token required]: [/products:id](http://localhost:3000/products/:id) [DELETE]
- Products by category: [/products/category/:category](http://localhost:3000/products/category/:category) [GET]

#### Users

- Index [token required]: [/users](http://localhost:3000/users) [GET]
- Show [token required]: [/users/:id](http://localhost:3000/users/:id) [GET]
- Create: [/users](http://localhost:3000/users) [POST]
- Authenticate: [/users/login](http://localhost:3000/users/login) [POST]

#### Orders

- Create [token required]: [/orders](http://localhost:3000/orders) [POST]
- Current Order by user [token required]: [/orders/:user_id](http://localhost:3000/orders/:user_id) [GET]
- Completed Orders by user [token required]: [/orders/completedOrdersByUser/:user_id](http://localhost:3000/orders/completedOrdersByUser/:user_id) [GET]

## Data Shapes

#### Product

- id [SERIAL PRIMARY KEY]
- name [VARCHAR(255)]
- price [INTEGER]
- category [VARCHAR(255)]

#### User

- id SERIAL [PRIMARY KEY]
- first_name [VARCHAR(255)]
- last_name [VARCHAR(255)]
- username [VARCHAR(255)]
- password [VARCHAR(255)]

#### Orders

- id [SERIAL PRIMARY KEY]
- user_id [INTEGER] (FOREIGN KEY (user_id) REFERENCES users(id))
- status [VARCHAR(255)]

#### Order_Products

- id [SERIAL PRIMARY KEY]
- order_id [INTEGER] (FOREIGN KEY (order_id) REFERENCES orders(id))
- product_id [INTEGER] (FOREIGN KEY (product_id) REFERENCES products(id))
- quantity [INTEGER]
