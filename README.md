
# CSF Music Mapper

A simple API implementing the CSF Internship Assignment 2024.
Written and developed by Dylan Rijnsburger


## API Reference

#### Get all items

```http
  GET /
```


#### Get item

```http
  GET /${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### Takes in the form

```http
  POST /
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `name`      | `string` | **Required**. Name of song |
| `artist`      | `string` | **Required**. Artist of song |
| `rating`      | `number` | **Required**. Rating from 1 to 5 |






## Deployment

Since this project is built using MongoDB, I have packaged it into a Docker-compose file.

```bash
  docker-compose up
```

The service should be available on localhost:3000



## Feedback

The first obvious improvement would be to flesh out the UI a bit more. Things such as creating a nice 5 star selector, creating some beautiful css for the overall application. 



