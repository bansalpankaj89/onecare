(function() {
    angular.module('mediDocApp.directive')
    .directive('mediListSelection', [mediDropdownList]);
    function mediDropdownList() {
        var mediDropdownList = function (scope, element, attr) {
            
            var init = function() {
                angular.forEach(scope.itemCollection, function(item) {
                    if(scope.selectedItems && Array.isArray(scope.selectedItems) && scope.selectedItems.filter(function(check) {
                        return check.description== item.description;
                    }).length>0){
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }
                });
            }
            init();
            
            
            
            scope.itemSelected = function(item) {
                if(attr.multiSelect == "false"){
                    if(scope.required && scope.required == "true"){
                        //if one item is selected and then trying to unselect the item
                        //will not allow the user to unselect unless he/she select another item
                        if(scope.selectedItems.filter(function(selItem) {
                            return selItem.description == item.description;
                        }).length>0){
                            item.selected = true;
                            return;
                        }
                    }
                    scope.selectedItems = [];
                    scope.selectedItems.push(item);
                    //let parent know that new item is selected
                    scope.onSelectionChanged(
                        { changedItem: item, 
                          changedState: true 
                        });
                    angular.forEach(scope.itemCollection, function(selectionItem) {
                        //for single selection let patent know that if already an item is selected
                        //no it will be set back to false       
                        if(selectionItem.selected && selectionItem != item){
                            selectionItem.selected = false;
                            scope.onSelectionChanged(
                            { changedItem: selectionItem, 
                              changedState: false 
                            });
                        }
                        
                        if(scope.selectedItems.filter(function(check) {
                            return check.description== selectionItem.description;
                        }).length>0){
                            selectionItem.selected = true;
                        } else {
                            selectionItem.selected = false;
                        }
                        
                    });
                } else {
                    if(scope.selectedItems && scope.selectedItems.filter(function(selItem) {
                        return selItem.description == item.description;
                    }).length > 0)
                    { 
                        var removeIndex;
                        scope.selectedItems.filter(function(selItem, index) {
                            if(item.description == selItem.description){
                                removeIndex = index;
                                return true;
                            }
                            return false;
                        });
                        scope.selectedItems.splice(removeIndex, 1);
                        scope.onSelectionChanged(
                            { changedItem: item, 
                              changedState: false 
                            });
                        return;
                    }           
                    if(!scope.selectedItems)
                        scope.selectedItems = [];
                    
                    scope.selectedItems.push(item);                    
                    scope.onSelectionChanged(
                        { changedItem: item, 
                          changedState: true 
                        });
                    
                }
                
                if(scope.selectedItems.length > 0) {
                    scope.$emit('item-selected', "true");
                        if(attr.multiSelect == "false"){
                      //  console.log("dd",scope.selectedItems[0].description);
                        scope.$emit('selectedItem', scope.selectedItems[0].description);
                    }
                } else {
                    scope.$emit('item-selected', "false");
                }
            }           
            
            scope.isSelected = function(item) {
                if(!scope.selectedItems)
                    return false;
                return scope.selectedItems.filter(function (selItem) {
                    return selItem.description === item.description;
                }).length >0;
            }
            
            scope.searchFilter='';  
            scope.itemName = attr.itemName;
            //scope.selectedItems = [];
            scope.shownGroup = false;
//            scope.scrollTop = function() {
//
//            }
            scope.toggleGroup = function() {
                return scope.shownGroup = !scope.shownGroup;
            };  
            scope.isItemSelected = function() {
                if(scope.selectedItems && scope.selectedItems.length > 0)
                    return true;
                return false;
            }
            
            scope.openProcess = function(process) {
                console.log('process',process);
                var alertPopup = $ionicPopup.alert({
                 title: 'Don\'t eat that!',
                 template: 'It might taste good'
                   });
            }


        };
        return {
            restrict: 'E',
            scope: {
                itemCollection: "=",
                selectedItems: '=',
                multiSelect: "@",
                required: "@",
                searchFilter: "=",
                onSelectionChanged: '&'
            },
            templateUrl: 'app/directive/selection-list/medi-list-selection.directive.html',
            link: mediDropdownList
        };
    };
})();