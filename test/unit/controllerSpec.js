describe('MainController', function() {

    beforeEach(module('whyApp'));

    it('should have the correct initial title', function() {
        var scope = {},
            ctrl = new MainController(scope);

        expect(ctrl.title).toBe('Why?');
    });
});
