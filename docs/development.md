# Development

I have now unified frontend and backend under the same docker-compose.
To launch both, in project root:

`docker compose up --build`

This also starts a PostgreSQL database for development. Database data is kept in a named Docker volume, so it survives normal restarts.

You can shutdown in the terminal by pressing `ctrl + c`, or stop and remove the containers with `docker compose down`.

If you want to reset the database too, run `docker compose down -v`.

For local environment overrides, copy `example.env` to `.env` and edit the values.
