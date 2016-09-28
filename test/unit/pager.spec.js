describe('the pager module given no options', () => {
    var pager;

    function noop() {
    }

    beforeEach(() => {
        pager = new Pager();
    });

    it('should not be able to page backward', () => {
        expect(pager.canPageBackward).toBeFalsy();
    });

    it('should not be able to page forward', () => {
        expect(pager.canPageForward).toBeFalsy();
    });

    it('should have current page', () => {
        expect(pager.currentPage).toEqual(1);
    });

    it('should not be able to page forward', () => {
        expect(pager.canPageForward).toBeFalsy();
    });

    it('should have its current page as default value', () => {
        expect(pager.currentPage).toEqual(1);
    });

    it('should not have more pages backward', () => {
        expect(pager.hasMorePagesBackward).toBeFalsy();
    });
            
    it('should not have more pages forward', () => {
        expect(pager.hasMorePagesForward).toBeFalsy();
    });

    it('should have an id defined', () => {
        expect(pager.id).toBeDefined();
    });

    it('should have an undefined input', () => {
        expect(pager.input).not.toBeDefined();
    });

    it('should have a logger defined', () => {
        expect(pager.logger).toBeDefined();
    });

    it('should have its maximum number of explicit pages to display as default value', () => {
        expect(pager.maximumNumberOfExplicitPagesToDisplay).toEqual(7);
    });

    it('should have no explicit pages', () => {
        expect(pager.pagesRange.length).toEqual(0);
    });

    it('should have no pages', () => {
        expect(pager.totalNumberOfPages).toEqual(0);
    });
});
