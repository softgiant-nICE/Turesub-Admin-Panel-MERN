1. Get Data
GET : ../api/app/get_data

Output : {
    is_success: true/false,
    errorMessage : string,
    data : {
        categories : [
            {
                _id : 0,
                url : imageURL,
                name : string,
                content : string,
                items : [
                    {
                        _id : 0,
                        url : imageURL,
                        name : string,
                        content : string,
                        sound : soundURL
                    }
                ]
            }
        ],
        extras : {
            url : imageURL,
            name : Extra,
            content : string,
            items : [
                {
                    _id : 0,
                    url : imageURL,
                    name : string,
                    content : string,
                    sound : soundURL
                }
            ]
        }
    }
}


2. Get notification
GET : ../api/app/get_notification

Output : {
    is_success : true/false,
    errorMessage : string,
    notifications : [
        {
            _id : string,
            is_updated : false,
            message : "Added category 5",
        },
    ]
}



3. Update data
POST : ../api/app/update_data

Input : {
    _id : string
}

Output : {
    is_success : true/false,
    errorMessage : string,
    state : 0,1,2,3 // 0: add, 1: edit, 2 : delete, 3 : extra data
    category_id : string / null,
    item_id : string / null,
    extra_id : string/null,
    // extra_item_id : string / null,
    data : {
        
    }
}