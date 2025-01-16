Brief information about this project:
1. POM implementation for code reuseablity/maintainability
2. Customn fixture for steps definition and code resuseablity/maintainability
3. GitHub actions for automated workflow tiggering automatic run upon new push or automated daily run 9GMT that fire html report
4. Test data maintained through excel file for easy maintanence 
5. Custom config loader for environment and test account parameterization
6. Parallel test setup with mutiple workers for speedy execution
7. Customized html report implementation
8. Latest report can be viewed from this link https://mnazrinasari.github.io/playwright2/playwright-html-report/index.html

How to setup and run the test locally?
Prerequisite: Install Node.js

1. Open terminal or cmd
2. Clone this repo
   git clone your-repository-name
3. Change into the project directory:
   cd your-repository-name
4. Install project dependencies
   npm install
5. Install Playwright Browser
   npx playwright install
6. Run playwright test in headed mode
   npx playwright test --headed