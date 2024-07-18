# InventoTrack  
Product Inventory Management System

This project is a web application for managing product inventory. It allows users to add new products, update quantities, delete products, search for products, and view inventory status.

## Features

- **Authentication**: Users can authenticate using NextAuth, ensuring secure access to the inventory management system.
- **Add Product**: Users can add new products by providing a name, quantity, and price.
- **Update Quantity**: Products' quantities can be updated by incrementing or decrementing.
- **Delete Product**: Products can be deleted from the inventory.
- **Search Products**: Users can search for products by name, with results displayed dynamically.
- **Inventory Status**: Visual representation of inventory status, including charts for better insights.

## Graphical Representation of Inventory

The system includes an interactive pie chart that visually represents the inventory status. Each slice of the pie corresponds to a product's name, and the size of each slice represents the quantity of that product relative to others. The color scheme dynamically adjusts based on the quantities:

- **Green**: Indicates the product with the largest quantity.
- **Red**: Indicates the product with the smallest quantity.
- Other colors represent intermediate quantities.


## Technologies Used

- **Frontend**: React with Next.js for server-side rendering.
- **Authentication**: NextAuth for authentication and session management.
- **Backend**: Node.js server for handling API requests.
- **Database**: MongoDB for storing product data.
- **Styling**: Tailwind CSS for responsive and utility-first styles.
- **Visualization**: Chart.js for interactive data visualization, used to create pie charts depicting product quantities dynamically.
