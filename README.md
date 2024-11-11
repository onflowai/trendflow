#### Complete App

[TrendFlow](https://google.com)

#### Create React APP

[VITE](https://vitejs.dev/guide/)

```sh
npm create vite@latest projectName -- --template react
```

#### Vite - Folder and File Structure

```sh
npm i
```

```sh
npm run dev
```

- APP running on http://localhost:5173/
- .jsx extension

#### Remove Boilerplate

- remove App.css
- remove all code in index.css

  App.jsx

```jsx
const App = () => {
  return <h1>TrendFlow App</h1>;
};
export default App;
```

#### Project Assets

- get assets folder from complete project
- copy index.css
- copy/move README.md (steps)
  - work independently
  - reference
  - troubleshoot
  - copy

#### Global Styles

- saves times on the setup
- less lines of css
- speeds up the development

- if any questions about specific styles
- Coding Addict - [Default Starter Video](https://youtu.be/UDdyGNlQK5w)
- Repo - [Default Starter Repo](https://github.com/john-smilga/default-starter)

#### Title and Favicon

- add favicon.ico in public
- change title and favicon in index.html

```html
<head>
  <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
  <title>TrendFlow</title>
</head>
```

- resource [Generate Favicons](https://favicon.io/)

#### Install Packages (Optional)

- yes, specific package versions
- specific commands will be provided later
- won't need to stop/start server

```sh
npm install @tanstack/react-query@4.29.5 @tanstack/react-query-devtools@4.29.6 axios@1.3.6 dayjs@1.11.7 react-icons@4.8.0 react-router-dom@6.10.0 react-toastify@9.1.2 recharts@2.5.0 styled-components@5.3.10

```

#### Router

[React Router](https://reactrouter.com/en/main)

- version 6.4 brought significant changes (loader and action)
- pages as independent entities
- less need for global state
- more pages

#### Setup Router

- all my examples will include version !!!

```sh
npm i react-router-dom@6.10.0
```

App.jsx

```jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>home</h1>,
  },
  {
    path: '/about',
    element: (
      <div>
        <h2>about page</h2>
      </div>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
```

# Sorting

### Pre-computation and Caching

Pre-computation: Calculate the scores periodically and store them in the database. This reduces the computational load during each request. Caching in real world frequently accessed data is stored in memory (e.g., Redis or Memcached) to speed up retrieval times.

### Incremental Updates

Incremental Updates: Instead of recalculating scores for all items, update scores incrementally when changes occur. For example, update the score of a trend when its view count increases or its status changes.

### Batch Processing

Batch Processing: Use background jobs (e.g., with Celery, Sidekiq, or AWS Lambda) to process large batches of trends and update their scores periodically.

### Real-time Adjustments

Real-time Adjustments: Apply small, quick adjustments to pre-computed scores based on real-time data. For example, adjust the rank of a trend slightly if it receives a high spike in views.

```
Real-time Adjustments in trendFlow: Update the trend's combined score whenever the trend's view count changes significantly.
Caching in trendFlow: Cache the results of frequently accessed queries and invalidate the cache when underlying data changes.
```

#### Weights Assignment:

The `weights` object assigns importance to each metric. Here, `t_score` has the highest weight (0.4), indicating it has the most influence on the combined score. This matches your indication that `t_score` is more important.

```javascript
const weights = {
  t_score: 0.4,
  views: 0.3,
  trendStatus: 0.1,
  f_score: 0.2,
};
```

This converts the trendStatus string into a numeric value. For example:
`breakout` trends get a higher value (1.2),
`stable` trends get a neutral value (1.0),

```javascript
const statusValue = trendStatus === 'breakout' ? 1.2 : trendStatus === 'stable' ? 1.0 : 0.8;
```

```javascript
return (t_score * weights.t_score) + (views * weights.views) + (statusValue * weights.trendStatus) + (f_score * weights.f_score);
```

# Scheduling

Scheduler for Node.

### Schedule the Task:

The cron.schedule function schedules updateScores to run at midnight every day (0 0 \* \* _).
You can change the cron expression to suit your scheduling needs. For example, to run every hour, use '0 _ \* \* \*'.

```
Cron Expression Examples
Every day at midnight: '0 0 * * *'
Every hour: '0 * * * *'
Every 30 minutes: '*/30 * * * *'
Every day at 1 AM: '0 1 * * *'
```
# MongoDB Features

## MongoDB Indexing
Indexing helps MongoDB quickly locate documents in a collection without scanning every document, significantly improving query performance, especially for larger collections.

## MongoDB Time Series Collections
Time Series Collections are optimized for storing time-based data, such as logs, metrics, and IoT data, where each entry includes a timestamp. Data in time series collections is organized by time, and data points from the same source (e.g., a single sensor or user session) are grouped for efficient retrieval and storage. MongoDB also uses specialized storage optimizations to reduce disk usage and improve query performance.
