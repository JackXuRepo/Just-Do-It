# Rest API Documentation
______
### **Authentication**

##### CREATE

- Description: Register an account
- Request: `POST /register/`
    - content-type: `application/json`
    - body: Object
        - username: (string) username
        - password: (string) password
        - name: (string) owner's name of the account
- Response: 200
    - content-type: `application/json`
    - body: Object
        - _id: (string) account id
        - username: (string) username
        - hashPassword: (string) hashed password
        - salt: (string) salt for password
        - friendsList: (Array) owner's friends list
        - pendingList: (Array) owner's pending friend request
- Response: 400
    - body: Incorrect username: Must contain 4-16 characters with initial character alphabetical
    - body: Incorrect password: Must contain 8-16 alphanumeric characters
    - body: Invalid registration
- Response: 409
    - body: Username exists
- Response: 500
    - body: Object
        - _id: (string) account id
        - username: (string) username
        - hashPassword: (string) hashed password
        - salt: (string) salt for password
        - friendsList: (Array) owner's friends list
        - pendingList: (Array) owner's pending friend request
``` 
$ curl -X POST 
       -H "Content-Type: `application/json`" 
       -d '{"username":"TestUsername","password":"testpassword", "name": "TestUser"} 
       https://just-do-it-games.herokuapp.com/register/'
```

- Description: Login using credentials
- Request: `POST /login/`
    - content-type: `application/json`
    - body: Object
        - username: (string) username
        - password: (string) password
- Response: 200
    - content-type: `application/json`
    - body: Object
        - _id: (string) account id
        - username: (string) username
        - hashPassword: (string) hashed password
        - salt: (string) salt for password
        - friendsList: (Array) owner's friends list
        - pendingList: (Array) owner's pending friend request
        - token: (string) web token for corresponding user
- Response: 400
    - body: Incorrect login information
- Response: 401
    - body: Incorrect login information
- Response: 500
    - body: Object
        - _id: (string) account id
        - username: (string) username
        - hashPassword: (string) hashed password
        - salt: (string) salt for password
        - friendsList: (Array) owner's friends list
        - pendingList: (Array) owner's pending friend request
``` 
$ curl -X POST 
       -H "Content-Type: `application/json`" 
       -d '{"username":"TestUsername","password":"testpassword"} 
       https://just-do-it-games.herokuapp.com/login/'
```

- Description: Checks for user authentication
- Request: `POST /isAuthenticated/`
    - content-type: `application/json`
    - body: Object
        - username: (string) username
        - token: (string) web token for corresponding user
- Response: 200
    - content-type: `application/json`
    - body: User Authenticated
- Response: 401
    - body: access denied
- Response: 500
    - body: Object
        - _id: (string) account id
        - username: (string) username
        - hashPassword: (string) hashed password
        - salt: (string) salt for password
        - friendsList: (Array) owner's friends list
        - pendingList: (Array) owner's pending friend request
``` 
$ curl -X POST 
       -H "Content-Type: `application/json`" 
       -d '{"username":"TestUsername","token":"Mjo1AFYSrDdCMZoRRHgu"} 
       https://just-do-it-games.herokuapp.com/isAuthenticated/'
```
------

### **Friend**

#### UPDATE

- Description: Add friend or send friend request
- Request: `PATCH /addFriend/`
    - content-type: `application/json`
    - body: Object
        - username: (string) username
        - friend: (string) friend's username
- Response: 200
    - content-type: `application/json`
    - body: Object
        - _id: (string) friend's account id
        - username: (string) friend's username
        - hashPassword: (string) friend's hashed password
        - salt: (string) friend's salt for password
        - friendsList: (Array) friend's friends list
        - pendingList: (Array) friend's pending friend request
- Response: 409
    - body: User does not exist
    - body: User is already a friend
    - body: Friend request already sent
    - body: Cannot add yourself
    - body: Current user does not exist
- Response: 500
    - body: Object
        - _id: (string) friend's account id
        - username: (string) friend's username
        - hashPassword: (string) friend's hashed password
        - salt: (string) friend's salt for password
        - friendsList: (Array) friend's friends list
        - pendingList: (Array) friend's pending friend request
``` 
$ curl --request PATCH 
       -H "Content-Type: `application/json`" 
       -d '{"username":"TestUsername","friend":"friendUser"} 
       https://just-do-it-games.herokuapp.com/addFriend/'
```

- Description: Delete friend from current user's friend list
- Request: `PATCH /deleteFriend/`
    - content-type: `application/json`
    - body: Object
        - username: (string) username
        - friend: (string) friend's username
- Response: 200
    - content-type: `application/json`
    - body: Object
        - _id: (string) account id
        - username: (string) username
        - hashPassword: (string) hashed password
        - salt: (string) salt for password
        - friendsList: (Array) owner's friends list
        - pendingList: (Array) owner's pending friend request
- Response: 409
    - body: User does not exist
    - body: Friend user does not exist
- Response: 500
    - body: Object
        - _id: (string) account id
        - username: (string) username
        - hashPassword: (string) hashed password
        - salt: (string) salt for password
        - friendsList: (Array) owner's friends list
        - pendingList: (Array) owner's pending friend request
``` 
$ curl --request PATCH 
       -H "Content-Type: `application/json`" 
       -d '{"username":"TestUsername","friend":"friendUser"} 
       https://just-do-it-games.herokuapp.com/deleteFriend/'
```

- Description: Delete friend from current user's friend list
- Request: `PATCH /deleteFriend/`
    - content-type: `application/json`
    - body: Object
        - username: (string) username
        - friend: (string) friend's username
- Response: 200
    - content-type: `application/json`
    - body: Object
        - _id: (string) account id
        - username: (string) username
        - hashPassword: (string) hashed password
        - salt: (string) salt for password
        - friendsList: (Array) owner's friends list
        - pendingList: (Array) owner's pending friend request
- Response: 409
    - body: User does not exist
    - body: Friend user does not exist
- Response: 500
    - body: Object
        - _id: (string) account id
        - username: (string) username
        - hashPassword: (string) hashed password
        - salt: (string) salt for password
        - friendsList: (Array) owner's friends list
        - pendingList: (Array) owner's pending friend request
``` 
$ curl --request PATCH 
       -H "Content-Type: `application/json`" 
       -d '{"username":"TestUsername","friend":"friendUser"} 
       https://just-do-it-games.herokuapp.com/deleteFriend/'
```

- Description: Reject friend request from pending friends request list
- Request: `PATCH /deleteFriend/`
    - content-type: `application/json`
    - body: Object
        - username: (string) username
        - friend: (string) friend's username
- Response: 200
    - content-type: `application/json`
    - body: Object
        - _id: (string) friend's account id
        - username: (string) friend's username
        - hashPassword: (string) friend's hashed password
        - salt: (string) friend's salt for password
        - friendsList: (Array) friend's friends list
        - pendingList: (Array) friend's pending friend request
- Response: 409
    - body: User does not exist
    - body: Friend user does not exist
- Response: 500
     - body: Object
        - _id: (string) friend's account id
        - username: (string) friend's username
        - hashPassword: (string) friend's hashed password
        - salt: (string) friend's salt for password
        - friendsList: (Array) friend's friends list
        - pendingList: (Array) friend's pending friend request
``` 
$ curl --request PATCH 
       -H "Content-Type: `application/json`" 
       -d '{"username":"TestUsername","friend":"friendUser"} 
       https://just-do-it-games.herokuapp.com/rejectFriend/'
```

- Description: Accept friend from current user's pending friends list
- Request: `PATCH /acceptFriend/`
    - content-type: `application/json`
    - body: Object
        - username: (string) username
        - friend: (string) friend's username
- Response: 200
    - content-type: `application/json`
    - body: Object
        - _id: (string) account id
        - username: (string) username
        - hashPassword: (string) hashed password
        - salt: (string) salt for password
        - friendsList: (Array) owner's friends list
        - pendingList: (Array) owner's pending friend request
- Response: 409
    - body: User does not exist
    - body: Cannot accept friend request
    - body: Friend user does not exist 
- Response: 500
    - body: Object
        - _id: (string) account id
        - username: (string) username
        - hashPassword: (string) hashed password
        - salt: (string) salt for password
        - friendsList: (Array) owner's friends list
        - pendingList: (Array) owner's pending friend request
``` 
$ curl --request PATCH 
       -H "Content-Type: `application/json`" 
       -d '{"username":"TestUsername","friend":"friendUser"} 
       https://just-do-it-games.herokuapp.com/acceptFriend/'
```
_____

### **Chat**

#### READ

- Description: Sends a message on behalf of a user 
- Request: `GET /send/`
- Response: 200
    - content-type: `application/json`
    - body: Object
        - message: (string) message from user
- Response: 500
    - body: Object
        - message: (string) message from user
``` 
$ curl -X GET 
       -H "Content-Type: `application/json`" 
       -d '{"username":"TestUsername"} 
       https://just-do-it-games.herokuapp.com/send/'
```
_____

### **Rooms**

#### READ

- Description: Gets a specific room using room Id
- Request: `GET /getRoom/ir7JXOEpLI/`
- Response: 200
    - content-type: `application/json`
    - body: Object
        - roomId: (string) room Id
- Response: 500
    - body: Object
        - roomId: (string) room Id
``` 
$ curl -X GET 
       -H "Content-Type: `application/json`" 
       https://just-do-it-games.herokuapp.com/getRoom/ir7JXOEpLI/'
```

_____

### **Waiting Room**

#### READ

- Description: Gets waiting room
- Request: `GET /getWaitingRooms/`
- Response: 200
    - content-type: `application/json`
    - body: Object
        - roomId: (string) room Id
- Response: 500
    - body: Object
        - roomId: (string) room Id
``` 
$ curl -X GET 
       -H "Content-Type: `application/json`" 
       https://just-do-it-games.herokuapp.com/getWaitingRooms/'
```
_____
