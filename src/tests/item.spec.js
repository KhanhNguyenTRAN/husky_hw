const chai = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const { expect } = chai;
chai.use(require('sinon-chai'));

const mongoose = require('mongoose');
const Item = require('../models/Item.model');

const itemController = rewire('../controllers/item.controller');

describe('Item Controller', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = { params: {}, body: {} };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('createItem', () => {
        it('should create an item', async () => {
            const newItem = {
                name: 'Test Item',
                description: 'Test Description',
                _id: new mongoose.Types.ObjectId(),
                createdAt: new Date()
            };
            req.body = { name: 'Test Item', description: 'Test Description' };
            const saveStub = sandbox.stub(Item.prototype, 'save').resolves(newItem);
    
            await itemController.createItem(req, res);
    
            expect(saveStub).to.have.been.calledOnce;
            expect(res.status).to.have.been.calledWith(201);
            expect(res.json).to.have.been.calledWith(sinon.match({
                name: 'Test Item',
                description: 'Test Description',
                _id: sinon.match.object,
                createdAt: sinon.match.date
            }));
        });
    
        it('should return an error if saving fails', async () => {
            req.body = { name: 'Test Item', description: 'Test Description' };
            const error = new Error('Save failed');
            sandbox.stub(Item.prototype, 'save').rejects(error);
    
            await itemController.createItem(req, res);
    
            expect(res.status).to.have.been.calledWith(400);
            expect(res.json).to.have.been.calledWith({ message: error.message });
        });
    });    

    describe('getAllItems', () => {
        it('should get all items', async () => {
            const items = [{ name: 'Item1' }, { name: 'Item2' }];
            sandbox.stub(Item, 'find').resolves(items);

            await itemController.getAllItems(req, res);

            expect(res.json).to.have.been.calledWith(items);
        });

        it('should return an error if fetching fails', async () => {
            const error = new Error('Fetch failed');
            sandbox.stub(Item, 'find').rejects(error);

            await itemController.getAllItems(req, res);

            expect(res.status).to.have.been.calledWith(500);
            expect(res.json).to.have.been.calledWith({ message: error.message });
        });
    });

    describe('getItemById', () => {
        it('should get an item by id', async () => {
            const item = { name: 'Item1' };
            req.params.id = '123';
            sandbox.stub(Item, 'findById').resolves(item);

            await itemController.getItemById(req, res);

            expect(res.json).to.have.been.calledWith(item);
        });

        it('should return 404 if item not found', async () => {
            req.params.id = '123';
            sandbox.stub(Item, 'findById').resolves(null);

            await itemController.getItemById(req, res);

            expect(res.status).to.have.been.calledWith(404);
            expect(res.json).to.have.been.calledWith({ message: 'Item not found' });
        });

        it('should return an error if fetching fails', async () => {
            const error = new Error('Fetch failed');
            req.params.id = '123';
            sandbox.stub(Item, 'findById').rejects(error);

            await itemController.getItemById(req, res);

            expect(res.status).to.have.been.calledWith(500);
            expect(res.json).to.have.been.calledWith({ message: error.message });
        });
    });

    describe('updateItem', () => {
        it('should update an item', async () => {
            const updatedItem = { name: 'Updated Item', description: 'Updated Description' };
            req.params.id = '123';
            req.body = updatedItem;
            sandbox.stub(Item, 'findByIdAndUpdate').resolves(updatedItem);

            await itemController.updateItem(req, res);

            expect(res.json).to.have.been.calledWith(updatedItem);
        });

        it('should return 404 if item not found for update', async () => {
            req.params.id = '123';
            req.body = { name: 'Updated Item', description: 'Updated Description' };
            sandbox.stub(Item, 'findByIdAndUpdate').resolves(null);

            await itemController.updateItem(req, res);

            expect(res.status).to.have.been.calledWith(404);
            expect(res.json).to.have.been.calledWith({ message: 'Item not found' });
        });

        it('should return an error if updating fails', async () => {
            const error = new Error('Update failed');
            req.params.id = '123';
            req.body = { name: 'Updated Item', description: 'Updated Description' };
            sandbox.stub(Item, 'findByIdAndUpdate').rejects(error);

            await itemController.updateItem(req, res);

            expect(res.status).to.have.been.calledWith(400);
            expect(res.json).to.have.been.calledWith({ message: error.message });
        });
    });

    describe('deleteItem', () => {
        it('should delete an item', async () => {
            req.params.id = '123';
            sandbox.stub(Item, 'findByIdAndDelete').resolves({});

            await itemController.deleteItem(req, res);

            expect(res.json).to.have.been.calledWith({ message: 'Item deleted' });
        });

        it('should return 404 if item not found for deletion', async () => {
            req.params.id = '123';
            sandbox.stub(Item, 'findByIdAndDelete').resolves(null);

            await itemController.deleteItem(req, res);

            expect(res.status).to.have.been.calledWith(404);
            expect(res.json).to.have.been.calledWith({ message: 'Item not found' });
        });

        it('should return an error if deletion fails', async () => {
            const error = new Error('Delete failed');
            req.params.id = '123';
            sandbox.stub(Item, 'findByIdAndDelete').rejects(error);

            await itemController.deleteItem(req, res);

            expect(res.status).to.have.been.calledWith(500);
            expect(res.json).to.have.been.calledWith({ message: error.message });
        });
    });
});
