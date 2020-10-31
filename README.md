[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/bjorn-87/trading-frontend/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/bjorn-87/trading-frontend/?branch=main) [![Build Status](https://scrutinizer-ci.com/g/bjorn-87/trading-frontend/badges/build.png?b=main)](https://scrutinizer-ci.com/g/bjorn-87/trading-frontend/build-status/main)


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Runs selenium test with mocha and ends with eslint.
Before you can run tests with this command you need to start up the API server [https://github.com/bjorn-87/trading-backend](https://github.com/bjorn-87/trading-backend) and start the client with `npm start`.
Recommended to use `npm run ci` instead.

### `npm run ci` Recommended

Start a server for the client on [http://localhost:3000](http://localhost:3000) and then runs the tests.
The API server [https://github.com/bjorn-87/trading-backend](https://github.com/bjorn-87/trading-backend) needs to be running first.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Krav 2 klient:

Använt mig av react och installerade det genom create-react-app.
Valde react dels då det är ett av de tre mest populära JSramverk och man kan göra väldigt mycket i det, dels då det inte är så hårt styrt vilket jag ser som positivt. Kan till exempel välja mellan att använda klasser, react-hooks eller göra egna vanilla-js funktioner. Jag har själv använt mig mest av klasser genom hela appen då jag känner att jag börjar få koll på hur de fungerar.

Då jag använt godissorter som aktier valde att kalla sidan för CandyExchange och gjorde en ganska enkel men stilren design genom hela sidan och använde avanza.se som inspiration.
Ville att man skulle kunna se aktierna innan man loggar in då man kan göra det på riktiga trading-sidor och har därför gjort så att indexsidan även är trading-sidan. Innan användaren loggat in så ser man aktierna och vilken kurs de ligger i och när man loggat in så visas även formulär för att köpa och sälja aktier. Har löst detta med ternery-operators i return delen av react-klassen.

För att få realtidsdata användes socket.io-client och använde mig av rickshaw för att rita ut graferna eftersom det verkade vara bästa alternativet för att visa realtidsdata. Andra verktyg jag tittade på var apexcharts och React Charts men hittade inte någon bra info hur man skulle använda sig av realtidsdata i dessa.
När man kommer in på sidan ser man graferna direkt och har login och register i navbaren. Loggan och texten bredvid den är även en länk till indexsidan.
När användaren loggar in så ersätts länkarna med stocks, my page och log out, där stocks är en länk till index/aktiesidan, mypage är sidan där användaren ser sin portfolio(aktier och kontobalans) och där användaren kan sätta in pengar på kontot via ett formulär. Lagt till en log out länk eftersom vid inloggning sparas e-postadress, token och variabeln loggedIn i localstorage. Kollar sedan om loggedIn är true på alla sidor som kräver autentisering. Vid utloggning töms sedan localstorage.

Har använt mig av npm paketet material-ui/icons för att skapa ikonerna i navbaren. Detta då det var smidigt att ha ett helt bibliotek av ikoner att välja mellan och det ser trevligare ut med ikoner i navbaren.
Har jobbat med att få sidan responsiv och har valt en media query på 700px som kändes passande. testat den i både chrome, firefox och androidmobil.

## Krav 5 Selenium tester:
Använt mig av verktygen mocha och selenium-webdriver för att köra dessa testcases.
Har inte gjort någon koppling till travis då det inte var ett krav och då backend-servern måste vara igång för att kunna köra testerna.
Testerna körs-lokalt genom att clona detta repo och [serverns](https://github.com/bjorn-87/trading-backend) och sedan starta servern och köra `npm run ci`.
Vill man använda kommandot `npm test` så måste man först starta klienten med npm start.

### Usecases:
1. Användaren ska kunna surfa till sidan, se att titeln i webbläsaren är CandyExchange och att ruouten är ”/”.
2. Användaren ska kunna gå från förstasidan till sidan för att registrera en användare genom att klicka på en länk i navbaren.
3. Användaren ska kunna ta sig från förstasidan till Login sidan för att sedan kunna ta sig tillbaka till indexsidan via att klicka på länkar i navbaren.
4. Användaren ska kunna klicka på en länk för att komma till login-sidan och sedan kunna logga in för att se sin personliga sida(mypage).
5. Användaren ska kunna klicka sig till login-sidan via en länk för att sedan logga in och därifrån klicka på en länk för att komma till sidan med aktier där det finns ett button-element för att köpa aktier.
