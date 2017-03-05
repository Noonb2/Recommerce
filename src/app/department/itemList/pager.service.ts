// import * as _ from 'underscore';

export class PagerService {
    getPager(totalItems: number, currentPage: number = 1, pageSize: number = 12, numpage: number) {
        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize);
        
        let startPage: number, endPage: number;
        if(numpage != 2){
            if (totalPages <= numpage) {
                // less than 5 total pages so show all
                startPage = 1;
                endPage = totalPages;
            } else {
                // more than 5 total pages so calculate start and end pages
                if (currentPage <= ((numpage/2)+1)) {
                    startPage = 1;
                    endPage = numpage;
                } else if (currentPage + Math.floor(numpage/2) >= totalPages) {
                    startPage = totalPages - (numpage-1);
                    endPage = totalPages;
                } else {
                    startPage = currentPage - Math.floor(numpage/2);
                    endPage = currentPage + Math.floor(numpage/2);
                }
            }
        } else if(numpage == 2){
            if (totalPages <= numpage) {
                // less than 5 total pages so show all
                startPage = 1;
                endPage = totalPages;
            } else {
                // more than 5 total pages so calculate start and end pages
                if (currentPage + Math.floor(numpage/2) >= totalPages) {
                    startPage = totalPages - (numpage-1);
                    endPage = totalPages;
                } else {
                    startPage = currentPage;
                    endPage = currentPage + Math.floor(numpage/2);
                }
            }
        }   

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        let pages = [];
        for(var i = startPage;i<=endPage;i++){
            pages.push(i);
        }
        // let pages = Array.from(Array(endPage),(_,i)=>startPage+i);
        
        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
}