


var vueRef;


function initVue(){

    Vue.component('list-item', {
        props:['item'],
        data:function(){
            var returnObj = {
                placeholder: "What's next?",
                priorities: this.$root.priorities,
                needsFocus:true,
                label:'',
                priority:0
            }

            if(this.item != undefined){
                returnObj.label = this.item.labelString;
                returnObj.priority = this.item.priorityI;
            }

            return returnObj;
        },
        watch:{
            item:{
                handler:function(newVal,oldVal){
                    if(newVal!=undefined && newVal.editMode===true){
                        this.label = this.item.labelString;
                        this.priority = this.item.priorityI;
                    }
                },
                deep: true
            }
        },
        template:'<div class="col-12">\
                    <p v-if="item!=undefined && !item.editMode" :class="\'container fr-\'+item.priorityI" v-on:click="editItem"><span class="fa fa-bookmark mr-3"></span>{{ item.labelString }}</p>\
                    <form v-else v-on:submit.prevent="submitItem">\
                        <div class="form-group row">\
                            <div class="col-lg-4 mb-sm-3"><input class="form-control" ref="newItemField" type="text" v-model="label" :placeholder="placeholder"/></div>\
                            <div class="col-lg-4 col-sm-5"><select class="form-control" v-model="priority"><option v-for="(pri,indx) in priorities" :key="indx" :value="indx">{{ pri }}</option></select></div>\
                            <div class="col-lg-4 col-sm-7"><span v-if="item==undefined" class="form-group"><button class="btn btn-primary" type="submit">Add</button></span>\
                            <span v-else class="form-group"><button class="btn btn-primary" type="submit">Update</button><button class="btn btn-warning ml-1" v-on:click="cancelEdit" type="button">Cancel</button><button class="btn btn-danger ml-1" type="button" v-on:click="removeItem">Remove</button></span></div>\
                        </div>\
                    </form>\
                    </div>',
        methods:{
            submitItem: function(){
                if(this.label != ''){
                    if(this.$props.item == undefined){
                        this.$root.addItem(this.label,this.priority);
                        this.label = '';
                        this.needsFocus = true;
                    } else {
                        this.$root.updateItem(this.$props.item.id,this.label,this.priority);
                    }
                }
            },
            editItem: function(){
                this.$root.enableItemEdit(this.item.id);
            },
            removeItem: function(){
                this.$root.removeItem(this.item.id);
            },
            cancelEdit: function(){
                this.$root.disableItemEdit(this.item.id);
                
                this.label = this.$props.item.labelString;
                this.priority = this.$props.item.priorityI;
            }
        },
        updated: function(){
            if(this.needsFocus){
                this.$refs.newItemField.focus()
                this.needsFocus = false;
            }
        }
    });


    vueRef = new Vue({
        el:'#vueEl',
        data:{
            listItemIdCounter:0,
            listItems:[],
            priorities: [
                'meh',
                'Important',
                'Life Changing'
            ]
        },
        methods:{
            addItem:function(str,i){
                var newItem = {
                    id: ++this.listItemIdCounter,
                    labelString:str,
                    priorityI:i,
                    editMode:false
                };
                this.listItems.push(newItem);
                this.listItems.sort(function(a,b){
                    if(a.priorityI==b.priorityI){
                        return 0;
                    } else if(a.priorityI>b.priorityI){
                        return -1;
                    }
                    return 1
                })
            },
            updateItem:function(id,str,i){
                var item = this.listItems.filter(function(val){
                    if(val.id==id){ return true;}
                    return false;
                })[0];

                item.labelString = str;
                item.priorityI = i
                item.editMode = false

                this.listItems.sort(function(a,b){
                    if(a.priorityI==b.priorityI){
                        return 0;
                    } else if(a.priorityI>b.priorityI){
                        return -1;
                    }
                    return 1
                })
            },
            clearAll:function(){
                this.listItems = [];
            },
            enableItemEdit:function(id){
                var item = this.listItems.filter(function(val){
                    if(val.id==id){
                        return true;
                    } else if(val.editMode) {
                        val.editMode = false
                    }
                    return false;
                })[0];
                item.editMode = true;
            },
            disableItemEdit:function(id){
                var item = this.listItems.filter(function(val){
                    if(val.id==id){ return true;}
                    return false;
                })[0];
                item.editMode = false;
            },
            removeItem:function(id){
                var index;
                this.listItems.map(function(val,arrI){
                    if(val.id==id){ index = arrI; }
                });
                if(index!=undefined){
                    this.listItems.splice(index,1);
                }
            },
            notEditing:function(){
                toReturn = true;
                this.listItems.map(function(val,arrI){
                    if(val.editMode===true){ toReturn = false; }
                });
                return toReturn;
            }
        }
    });
}


    $(document).ready(function(){
        initVue();
    });
