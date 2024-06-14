
# Buzz Box

Buzz Box is a chat application similar to Discord, offering a wide range of features to facilitate seamless communication among users. Built with modern technologies like Next.js, Prisma, PostgreSQL, Shadcn UI, and UploadThing, Buzz Box aims to provide a smooth and responsive chatting experience.


## DataBase Design
![image](/assets/buzzbox.png)

## Workflow
![image](/assets/work-flow%20diagram.png)
## Features

- **Real-time Messaging**: Instant messaging with friends and groups.
- **Voice and Video Calls**: High-quality voice and video calls.
- **File Sharing**: Easy file uploads and sharing with integrated UploadThing.
- **User Management**: Secure user authentication and profile management.
- **Customizable UI**: Beautiful and responsive UI powered by Shadcn UI.
- **Database**: Robust data handling with Prisma and PostgreSQL.

## Technologies Used

- **Next.js**: A React framework for server-side rendering and generating static websites.
- **Prisma**: A next-generation ORM for Node.js and TypeScript.
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **Shadcn UI**: A set of components for building beautiful user interfaces.
- **UploadThing**: A simple and flexible file upload solution.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- PostgreSQL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/buzz-box.git
   cd buzz-box
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory and add your PostgreSQL connection string and other necessary environment variables:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open your browser and navigate to `http://localhost:3000`.

## Project Structure

- `pages/`: Contains the Next.js pages.
- `components/`: Reusable React components.
- `prisma/`: Prisma schema and migrations.
- `public/`: Static files.
- `styles/`: Global and component-specific styles.
- `utils/`: Utility functions.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add some feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by [Discord](https://discord.com/).
- Built with [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/), [Shadcn UI](https://shadcn.dev/), and [UploadThing](https://uploadthing.com/).

---
