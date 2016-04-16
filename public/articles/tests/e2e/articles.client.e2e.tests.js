describe('Articles E2E Tests:', function () {
  describe('New Article Page', function () {
    it('Should not be able to create a new article', function () {
      browser.get('http://localhost:8080/#!/articles/create');
      element(by.css('input[type=submit]')).click();
      element(by.binding('error')).getText().then(function (errorText) {
        expect(errorText).toBe('User is not logged in');
      });
    });
  });
});