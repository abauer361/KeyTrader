# SE-498 Spring-2020 Final Delivery
Due date: May 18th

Demo will be done during class on May 18th during normal finals time. 15 min of prep time will be provided for any final tweaks.


# Final Test Procedure (Page details are at end)
0. Download virtual machine, setup and run the system as per the readme's.
1. Go to Login page
2. Click Login button and be redirected to Discord
3. Click authorize button and be redirected to Server Selection page
4. Click a server to add Key Trader to
5. Go through steps for two different servers to show that the service works for multiple servers
6. After adding servers, select a server to view
7. Click on Server Settings page
    * Map discord roles for each Key Trader role. Press save and reload page to see that changes were saved
    * Configure Bot notifications for:
        * Keys being added
        * Keys being claimed
        * New user accessing the server
8. Go back to Server Action Page
9. Go to Add Key, and add a Steam key
10. Go to See Keys, and redeem a key
11. Add a few more keys (both Steam and other)
12. Login as several different users belonging to the discord server that was linked and demonstrate the different Key Trader access roles
    * User 1 no roles, no access. (Can disable the buttons for see and add keys)
    * User 2 add keys only
    * User 3 redeem keys only
    * User 4 add/redeem keys
13. Verify that the bot correctly notified the specified channel in 7b.
14. Verify that the bot commands to get the number of keys and number of users in the server using the bot commands require the Admin Key Trader role (not Discord admin)


# Page Details
## Server Selection Page
Contains two sections of server selections

### First section: Servers that user is owner of
Selecting a server here prompts the user to add the bot to the server selected

### Second section: Servers that user is part of and have Key Trader active
Selecting a server here takes the user to the server actions page

For the Final this page consists of three links:
* See Keys
* Add Key
* Server Settings

## See Keys Page
For the final, this page consists of a list of games with a redeem button that takes the user to a new page with all of the key information.

The list of games has the following information:
* Game name
* Game price
* Game Key
* Steam store page (if steam key)

## Add Key Page
For the final, this page consists of a dropdown to select other or Steam, input boxes, and submit button(s).

### Steam
If the user selects Steam, a input box for the store page shall be displayed. Upon hitting submit, Key Trader will make a request to Steam's api to get the data and prepopulate the input boxes for the game. The user must press submit again to confirm that the information was filled out properly.

### Other
If the user selects Other, the normal input boxes will be displayed as empty.

### Input boxes
The input boxes for a game consists of:
* Steam store page (if steam key)
* Game name
* Game price
* Game Key

After adding the key, the user should be redirected to the server actions page unless the "Add another" checkbox was ticked. Once ticked, the checkbox shall remained ticked until the user unticks it (persists page reloads, but not local storage cleared).

## Server Settings Page
For the final, this page consists of role mapping and bot configuration.

### Role Mapping
This section maps Discord Server Roles to Key Trader roles.

An example design of this mapping would be showing a list of discord and having a dropdown menu next to it to select which role the discord role should be mapped to

```
|-------------|----------------|
|DiscordRole1 |KeyTraderRole1 v|
|DiscordRole2 |KeyTraderRole2 v|
|DiscordRole3 |KeyTraderRole3 v|
|DiscordRole4 |KeyTraderRole4 v|
             ...
|-------------|----------------|
```

### Bot Configuration
Each notification in step 7 shall be able to be enabled or disabled, and which channel to have to bot message.

## User Redeemed Keys
For the final this page should show a list of:
* Game name
* Game price
* Game Key
* Steam store page (if steam key)
