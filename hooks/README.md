Allison Thompson\
1847513\
Harnack\
SE 330\
Project 3 Angular Unit Testing

### Programs
* Python 2.7.16
* Lint

### Local Setup
1. Enable hidden files in finder.
2. Move "pre-commit" and "post-commit" to ".git/hooks"
3. Flag each git hook as an executable.
> chmod +x .git/hooks/pre-commit\
> chmod +x .git/hooks/post-commit
4. Run install.
> npm install

### VM Setup
1. Open VM and navigate to location you wish to install ChromeHeadless.
2. Run the following commands:
> sudo apt-get update\
> sudo apt-get install -y libappindicator1 fonts-liberation\
> wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
> sudo dpkg -i google-chrome*.deb
3. If you run into errors, follow the instructions on this page: https://blog.softhints.com/ubuntu-16-04-server-install-headless-google-chrome/

### Run VM Unit Tests
1. Open your VM and navigate to "key-trader" directory.
2. Run command.
> ng test

### I/O Description
When user runs "git commit" the code will be automatically formatted through lint and the user will be prompted if they wish to perform unit tests.  If the files are changed through formatting, the git commit will abort and allow the user to review changes.  If the unit tests are run the user will be given an output indicating which tests passed or failed.  After the commit is complete a post commit message will run.

### Handled Errors
When autoformat is run via git hook and an autoformat-generated change is detected, the commit will quit via exit code 1.  The error is purposefully triggered so that the commit aborts.  A user may run "git diff" if they wish to view the changes prior to pushing the commit.

### Errors
Unit testing could not be added to the git hook, as it requires ssh in to the vm, which could not be done through the git hook python.  I have instead left the unit testing prompt in so that it may be linked to docker for unit testing in the future.

### Progress
5 points- Research Git Hooks and create basic hooks for precommit and postcommit
> completed general precommit setup 10/8/2020\
> completed general post commit 10/8/2020\
> altered post commit for accuracy of message 10/12/2020\
> in progress: altering pre-commit to implement unit tests 11/2/2020

5 points- Research Angular unit testing using spec files
> completed research 11/2/2020

10 points- Create a Git hook to autoformat code during precommit and prompt user to add any changes and commit
> skeleton for autoformat 10/11/2020\
> prompt user for changes 10/11/2020\
> implement abort to add changes 10/11/2020\
> change prompt to show files changed and abort if 1+ files 10/12/2020\
> research autoformat tools and running shell scripts from python 10/19/2020\
> implement autoformat via npm script 10/19/2020

20 points- Implement Angular unit tests for two nontrivial components (like add server page and add key)
> readying testing through "ng test" by including imports in each test file (HTTPClient,Router) 10/26/2020\
> completed unit tests for access-denied.component.spec.ts and nav-menu.component.spec.ts 11/2/2020

10 points- Add precommit hook to ask user if they'd like to run unit tests and run them if yes otherwise commit
> prompt user for unit testing 10/11/2020\
> skeleton to run unit tests 10/11/2020\
> Could not be completed due to ssh incompatibility with git hooks.  Instead prompt is left alone so docker may be set up in future project for unit testing 11/2/2020

This issue does not require unit tests for all components to be implemented.
> prompt user function 10/11/2020\
> added comments 10/12/2020

### References
* https://www.omerkatz.com/blog/2013/5/23/git-hooks-part-2-implementing-git-hooks-using-python
* https://stackoverflow.com/questions/7437261/how-is-it-possible-to-use-raw-input-in-a-python-git-hook
* https://www.twilio.com/blog/npm-scripts
* https://www.youtube.com/watch?v=lHAeK8t94as
* https://janakiev.com/blog/python-shell-commands/
* https://blog.softhints.com/ubuntu-16-04-server-install-headless-google-chrome/
* https://stackoverflow.com/questions/41019109/error-no-provider-for-router-while-writing-karma-jasmine-unit-test-cases
* https://stackoverflow.com/questions/50750287/how-to-find-right-button-using-text-in-angular-2-for-unit-test-case
* https://www.youtube.com/watch?v=Yod3tBt0beM
* https://medium.com/@shashankvivek.7/testing-basic-html-elements-using-karma-jasmine-in-angular-fd5e4ac62d78
* https://duncanhunter.gitbook.io/testing-angular/test-the-component-logic-using-spyon
