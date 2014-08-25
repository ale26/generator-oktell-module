'use strict';


app.module({
  name: '<%= moduleId %>',
  options: {
    translations: {
      ru: 'translations/ru.json'
    }
  },
  states: [
    {
      url: '/',
      stateName: 'main',
      views: {
        column1: {
          controller: '<%= ctrlPrefix %>MainCtrl',
          templateUrl: 'views/main.html'
        }
      }
    },
    {
      url: '/some-page',
      stateName: 'main.some-page',
      views: {
        column2: {
          controller: '<%= ctrlPrefix %>SomePageCtrl',
          templateUrl: 'views/some-page.html'
        }
      }
    }
  ]
});
