# vagabundo-api
REST API defined using OpenAPI and Swagger.

# Setup Swagger

We only want to store the yaml definition file for our API within this repository and no swagger fluff. Hence, a developer has to setup Swagger themself when whishing to modify the files using the Swagger UI.

For this, install swagger:

    npm install -g swagger

Next, you should setup a swagger project whereever you want. This project should not be checked into the repository!

    swagger project create swagger-vagabundo

Next, remove the default swagger.yaml file:

    rm swagger-vagabundo/api/swagger./swagger.yaml

And create a symlink to include our API definitions

    ln -s <PATH-TO-VAGABUNDO-API>/api.yaml swagger-vagabundo/api/swagger/swagger.yaml

And serve swagger by issueing

    swagger project edit swagger-vagabundo

This should open your browser and you should be able to see and edit the API visually.
