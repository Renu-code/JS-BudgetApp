var budgetController=(function()
{
    var Income=function(id,description,value)
    {
        this.id=id;
        this.description=description;
        this.value=value;
        
    };

    var Expense=function(id,description,value)
    {
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    };
    
    Expense.prototype.calcPercentage=function(totalIncome){
        
        if(totalIncome>0)
        {
             this.percentage=Math.round((this.value/totalIncome)*100);
        }
        else
        {
            this.percentage=-1
        }

    };
    Expense.prototype.getPercentages=function(){
        return this.percentage;
    };

   

    var calculateTotal=function(type)
    {
       var sum=0;
       data.allitems[type].forEach(function(cur){
           sum+=cur.value;
       });

        data.totals[type]=sum;
        
    };

    var data={
        allitems:
        {
            inc:[],
            exp:[]

        
        },
        totals:
        {
            inc:0,
            exp:0
        },
        budget:0,
        percentages:-1,
    }
    return {
        addItem:function(type,des,val)
        {
            var ID,newItem;
            if(data.allitems[type].length>0)
            {
                ID=data.allitems[type][data.allitems[type].length -1].id+1;
            }
            else
            {
                ID=0;
            }
            
            if(type==='exp')
            {
                newItem=new Expense(ID,des,val);
            }
            else if(type==='inc')
            {
                newItem=new Income(ID,des,val);
            }

            data.allitems[type].push(newItem);


            return newItem;
        },
        deleteItem:function(type,id)
        {
            var ids,index;

            ids=data.allitems[type].map(function(cur){
                return cur.id;
            });

            index=ids.indexOf(id);

            if(index!==-1)
            {
                data.allitems[type].splice(index,1);
            }


            

        },
        calculateBudget:function()
        {
            //calculate total income
            calculateTotal('exp');
            calculateTotal('inc');
            console.log(data.totals.inc);


            //calculate the budget
            data.budget=data.totals.inc - data.totals.exp;


            //calculate the percentages
            if(data.percentages>0)
            {
                data.percentages=Math.round((data.totals.exp/data.totals.inc)*100);
            }
            else
            {
                data.percentages=-1;
            }
            
            
        },

        calculatePercenatge:function()
        {
            data.allitems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercntage:function()
        {
            var allPerc;
            allPerc= data.allitems.exp.map(function(cur){
                return cur.getPercentages();                              
                
            });
            return allPerc;
        },

        getBudget: function(){
            return {
                budget:data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage:data.percentages
            };

        },
        
        testing:function()
        {
            console.log(data);
        }
    }


})();

var UIController=(function()
{
    var DomStrings= {
         inputtype:'.add__type',
         inputdescription:'.add__description',
         inputvalue : '.add__value',
         inputaddbtn:'.add__btn',
         incomecontainer:'.income__list',
         expensecontainer:'.expenses__list',
         monthupdate:'.budget__title--month',
         incomeLabel:'.budget__income--value',
         expenseLabel:'.budget__expenses--value',
         budgetLabel:'.budget__value',
         percenatgeLabel:'.budget__expenses--percentages',
         containerLabel:'.container',
         expensesPercentage:'.item__percentage',


                     
     };
     
     var formatNumber=function(num,type)
     {
         var splitnum,int,dec,sign;
         //+ 2,1500.00

         num=Math.abs(num);
         num=num.toFixed(2);

         splitnum=num.split('.');
         int=splitnum[0];

         if(int.length>3)
         {
             int=int.substr(0,int.length-3) + ',' + int.substr(int.length-3,3);
         }
           

         dec=splitnum[1];

         type==='exp'?sign='-':sign='+';

         return sign + int + '.' + dec;




     };
     var nodelistForEach=function(list,callback){
        for(var i=0;i<list.length;i++)
        {
            callback(list[i],i);
        }
    };
     
    return {
        
        getInput:function () {
            return{
               type:document.querySelector(DomStrings.inputtype).value,
               description:document.querySelector(DomStrings.inputdescription).value,
               value:parseFloat(document.querySelector(DomStrings.inputvalue).value),



            };
        },
         /*nodelistForEach:function(callback)
         /* {
              for(var i=0;i<list.length;i++)
            {
                callback(list[i],i);
            }
        },*/

        addListItems:function(obj,type)
        {
            var html,newhtml,element;
            
            if(type==='inc')
            {
                element=DomStrings.incomecontainer;
                html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if(type==='exp')
            {
                element=DomStrings.expensecontainer;
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description% </div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">35%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newhtml=html.replace('%id%',obj.id);
            newhtml=newhtml.replace('%description%',obj.description);
            newhtml=newhtml.replace('%value%',formatNumber(obj.value,type));


            document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);
           

        },

        deleteListItem:function(selectorId)
        {
            var el;
            el=document.getElementById(selectorId)
            el.parentNode.removeChild(el);
                                   
        },

        displayDates:function()
        {
            var now,month,months,year;

            now=new Date();
            year=now.getFullYear();
            months=['January','February','March','April','may','June','July','August','September','October','November','December'];

            month=now.getMonth();

            document.querySelector(DomStrings.monthupdate).textContent=months[month] + ' ' +year;

  

        },

        changevent:function()
        {
            var fields;
            fields=document.querySelectorAll(
                DomStrings.inputtype + ','+DomStrings.inputdescription+','+DomStrings.inputvalue
            );

           

          
            nodelistForEach(fields,function(cur){
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DomStrings.inputaddbtn).classList.toggle('red');
        },

        clearFields:function()
        {
            var fields,arrFields;

            fields=document.querySelectorAll(DomStrings.inputdescription + ',' + DomStrings.inputvalue);

            arrFields=Array.prototype.slice.call(fields);

            arrFields.forEach(function(current,index,array){
                current.value="";

            });



        },
        displayBudget:function(obj)
        {
            var type;
            obj.budget>0?type='inc':type='exp';
            document.querySelector(DomStrings.budgetLabel).textContent=formatNumber(obj.budget,type);
            document.querySelector(DomStrings.incomeLabel).textContent=formatNumber(obj.totalInc,'inc');
            document.querySelector(DomStrings.expenseLabel).textContent=formatNumber(obj.totalExp,'exp');
            if(obj.percentage!==-1)
            {
                document.querySelector(DomStrings.percenatgeLabel).textContent=obj.percentage + '%';
            }
            else
            {
                document.querySelector(DomStrings.percenatgeLabel).textContent='---';
            }
            
            
        },

        displayPercentages:function(percentages)
        {
            fields=document.querySelectorAll(DomStrings.expensesPercentage);
            
            nodelistForEach(fields,function(cur,index){
                if(percentages[index]!==-1)
                {
                    cur.textContent=percentages[index] + '%';
                }
                else
                {
                    cur.textContent='---';
                }

            });
        },


        getDomStrings:function()
        {
            return DomStrings;
        }
    };

})();

var Controller=(function(Budgetctrl,Uictrl)
{
 

 var setupEventListeners=function()
 {
    var Dom=Uictrl.getDomStrings();
    document.querySelector(Dom.inputaddbtn).addEventListener('click',ctrladditem);

    document.querySelector(Dom.inputtype).addEventListener('change',Uictrl.changevent);


    document.addEventListener('keypress',function(event)
    {
        if(event.keycode===13 || event.which===13)
        {
          ctrladditem();
      }
     

    });

    document.querySelector(Dom.containerLabel).addEventListener('click',ctrlDeleteItem);     
 };
 


    var updateBudget=function()
    {
        //calculate the budget
        Budgetctrl.calculateBudget();


        //returm the budget
        var budget=Budgetctrl.getBudget();

        //add to the ui
        Uictrl.displayBudget(budget);
    };

    var updatePercentage=function()
    {
        //calculate percenatge
        Budgetctrl.calculatePercenatge();

        //read the percenatge
        var percentages=Budgetctrl.getPercntage();

        //display into the ui
        //console.log(percentages);
        Uictrl.displayPercentages(percentages);
    }

    var ctrladditem=function()
    {
         // get the input
         var input,newitem;
         input=Uictrl.getInput();
         console.log(input);



         if(input.description!=="" && !isNaN(input.value) && input.value>0)
         {
             //add to the budget controller

        newitem=budgetController.addItem(input.type,input.description,input.value);
        
        //add to the ui
        Uictrl.addListItems(newitem,input.type);

        //clear the field

        Uictrl.clearFields();

        //calculate the budget
        updateBudget();
            
         }

         //calculate and updating percenatge
         updatePercentage();

        
        //console.log("work");
    }

    var ctrlDeleteItem=function(event)
    {

        var itemID,splitId,ID,type;

        itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID)
        {
            splitId=itemID.split('-');
            type=splitId[0];
            ID=parseInt(splitId[1]);


        }

        //delete the item from data structure from budget controller
        Budgetctrl.deleteItem(type,ID);


        //deleting the item from the ui
        Uictrl.deleteListItem(itemID);


        //updating the budget
        updateBudget();


         //calculate and updating percenatge
         updatePercentage();
       

    };

   

    return{
        init:function(){
            Uictrl.displayDates();
           Uictrl.displayBudget
           ({
             budget:0,
             totalInc:0,
              totalExp:0,
              percentage:-1
           });
           setupEventListeners();

        }
    }

})(budgetController,UIController);
Controller.init();