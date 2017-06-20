/// <reference path="../typings/index.d.ts" />

import * as assert from 'assert'
import * as jemsdi from "../distribution/Index";
import FakeTypeA from './fake_types/FakeTypeA';
import FakeTypeB from './fake_types/FakeTypeB';
import FakeTypeC from "./fake_types/FakeTypeC";
import { IContainer } from "../distribution/IContainer";

describe('with containeraized resolution', function() {

    let kernel:jemsdi.Kernel = new jemsdi.Kernel();    
    let containerBAlias = 'containerB';
    let containerCAlias = 'containerC';

     before(async function() {

        await kernel.createContainer(containerBAlias);
        await kernel.createContainer(containerCAlias);

        let defaultContainer:IContainer = await kernel.getCurrentContainer(); 

        await defaultContainer.registerDependencyMetadata('fakeType', ({
            servingStrategy: jemsdi.ServicingStrategy.INSTANCE,
            activationReference: FakeTypeA,
            activateAsSingelton: false
        }));

        await defaultContainer.registerDependencyMetadata('fakeTypeA', ({
            servingStrategy: jemsdi.ServicingStrategy.INSTANCE,
            activationReference: FakeTypeA,
            activateAsSingelton: false
        }));        

        let containerB:IContainer = await kernel.getContainer(containerBAlias);

        await containerB.setSupportContainersAliases(['default']);   

        await containerB.registerDependencyMetadata('fakeType', ({
            servingStrategy: jemsdi.ServicingStrategy.INSTANCE,
            activationReference: FakeTypeB,
            activateAsSingelton: false
        }));

        await containerB.registerDependencyMetadata('fakeTypeB', ({
            servingStrategy: jemsdi.ServicingStrategy.INSTANCE,
            activationReference: FakeTypeB,
            activateAsSingelton: false
        }));
        
        let containerC:IContainer = await kernel.getContainer(containerCAlias);

        await containerC.setSupportContainersAliases([containerBAlias]);       

        await containerC.registerDependencyMetadata('fakeType', ({
            servingStrategy: jemsdi.ServicingStrategy.INSTANCE,
            activationReference: FakeTypeC,
            activateAsSingelton: false
        }));

        await containerC.registerDependencyMetadata('fakeTypeC', ({
            servingStrategy: jemsdi.ServicingStrategy.INSTANCE,
            activationReference: FakeTypeC,
            activateAsSingelton: false
        }));        
     });
    
    it('should resolve an instance of FakeTypeA with fakeType alias because is registered in the container that is currently in use.', async function() {
        await kernel.useDefaultContainer();
        let resolvedObject:FakeTypeA = await  kernel.resolve('fakeType');
        assert.ok((resolvedObject instanceof FakeTypeA) == true, 'The resolved type is not: FakeTypeA');             
    });    

    it('should resolve an instance of FakeTypeA with fakeTypeA alias because is registered.', async function() {
        await kernel.useDefaultContainer();
        let resolvedObject:FakeTypeA = await  kernel.resolve('fakeTypeA');
        assert.ok((resolvedObject instanceof FakeTypeA) == true, 'The resolved type is not: FakeTypeA');             
    });

    it('should resolve an instance of FakeTypeB with fakeTypeB alias because is registered and can resolve A as a dependency of B because is supported by the default container.', async function() {
        await kernel.useContainer(containerBAlias);
        let resolvedObject:FakeTypeB = await kernel.resolve('fakeTypeB');
        assert.ok((resolvedObject instanceof FakeTypeB) == true, 'The resolved type is not: FakeTypeB');                 
        assert.ok((resolvedObject.fackeTypeAIntance instanceof FakeTypeA) == true, 'The resolved A dependency type is not: FakeTypeA');          
    });

    it('should resolve an instance of FakeTypeB with fakeType alias because is registered in the container that is currently in use.', async function() {
        await kernel.useContainer(containerBAlias);
        let resolvedObject:FakeTypeB = await  kernel.resolve('fakeType');
        assert.ok((resolvedObject instanceof FakeTypeB) == true, 'The resolved type is not: FakeTypeB');             
    });

    it('should resolve an instance of FakeTypeC with fakeTypeC alias because is registered and can resolve A and B as a dependency of C because is supported by the containerB that is supported by the default container.', async function() {
        await kernel.useContainer(containerCAlias);
        let resolvedObject:FakeTypeC = await kernel.resolve('fakeTypeC');
        assert.ok((resolvedObject instanceof FakeTypeC) == true, 'The resolved type is not: FakeTypeC');
        assert.ok((resolvedObject.fackeTypeAIntance instanceof FakeTypeA) == true, 'The resolved A dependency type is not: FakeTypeA'); 
        assert.ok((resolvedObject.fackeTypeBIntance instanceof FakeTypeB) == true, 'The resolved B dependency type is not: FakeTypeB');            
    });

    it('should resolve an instance of FakeTypeC with fakeType alias because is registered in the container that is currently in use.', async function() {
        await kernel.useContainer(containerCAlias);
        let resolvedObject:FakeTypeC = await  kernel.resolve('fakeType');
        assert.ok((resolvedObject instanceof FakeTypeC) == true, 'The resolved type is not: FakeTypeC');             
    });
});