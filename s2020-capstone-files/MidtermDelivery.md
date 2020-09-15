# SE-498 Spring-2020 Midterm Delivery
Due date: March 14th/March 16th

Pull request to master must be in by time I wake up Saturday March 14th (roughly 10am). This allows me to give comments on the code prior to the midterm delivery.

Demo will be done during class on March 16th.

# Midterm Test Procedure (Page details are at end)
1. Go to Login page
2. Click Login button and be redirected to Discord
3. Click authorize button and be redirected to Server Selection page
4. Click a server to add Key Trader to
5. Go through steps for two different servers to show that the service works for multiple servers
6. After adding servers, select a server to view
7. Click on Server Settings page, and map discord roles for each Key Trader role. Press save and reload page to see that changes were saved
8. Go back to Server Action Page
9. Go to Add Key, and add a key
10. Go to See Keys, and redeem a key
11. Add a few more keys
12. Login as several different users belonging to the discord server that was linked and demonstrate the different Key Trader access roles
    * User 1 no roles, no access. (Can disable the buttons for see and add keys)
    * User 2 add keys only
    * User 3 redeem keys only
    * User 4 add/redeem keys

# Page Details
## Server Selection Page
Contains two sections of server selections

### First section: Servers that user is owner of
Selecting a server here prompts the user to add the bot to the server selected

### Second section: Servers that user is part of and have key trader active
Selecting a server here takes the user to the server actions page

For the midterm this page consists of three links:
    * See Keys
    * Add Key
    * Server Settings

## See Keys Page
For the midterm, this page consists of a list of games with a redeem button that takes the user to a new page with all of the key information

## Add Key Page
For the midterm, this page consists of a few text boxes and a button to add the key

After adding the key, the user should be redirected to the server actions page 

## Server Settings Page
For the midterm, this page consists of discord to key trader role mapping.
    * An example design of this mapping would be showing a list of discord and having a dropdown menu next to it to select which role the discord role should be mapped to

```
|-------------|----------------|
|DiscordRole1 |KeyTraderRole1 v|
|DiscordRole2 |KeyTraderRole2 v|
|DiscordRole3 |KeyTraderRole3 v|
|DiscordRole4 |KeyTraderRole4 v|
             ...
|-------------|----------------|
```

## User Redeemed Keys
For the midterm this is a very basic page just showing the keys that the user has redeemed

