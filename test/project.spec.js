const sinon = require('sinon')
const expect = require('chai').expect
const fs = require('fs')
const request = require('request')

const TemplateSource = require('../bin/templateSource');

// describe('คำอธิบายว่าเราจะ Test เรื่องอะไร', () => {
//     beforeEach(() => {
//         // beforeEach ทุก Test case เราจะเข้า function นี้ก่อนเสมอ
//     });
//
//     before(() => {
//         // before คือ เราจะทำ function นี่ก่อนทำ Test case ครั้งแรกครั้งเดียว
//     });
//     afterEach(() => {
//         // afterEach เมื่อจบ Test case แต่ละ Test case เราจะทำ function นี้
//     });
//     after(() => {
//         // after เมื่อจบทุก Test case ถึงจะทำ function นี้
//     });
//     it('คำอธิบาย Test case', () => {
//         // test case
//     });
// });


describe('Test class TemplateSource', () => {
    beforeEach(function () {
        this.sandbox = sinon.sandbox.create()
    })

    afterEach(function () {
        this.sandbox.restore()
    })
    it('success when downloadTemplate', () => {
        let ts = new TemplateSource('mockProject', 'mockModule', 'mockPath');

        let result = ts.downloadTemplate();
    });
});