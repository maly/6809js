module("Syntax and coding standards");

jsHintTest( "JSHint", "../6809.js");

module("Basic tests");

test( "Namespace", function() {
	notEqual( CPU6809, null, "CPU6809 is defined" );
    equal( typeof(CPU6809), "object", "CPU6809 is an object" );
});


module("Simple OP tests");
var RAM = [0,2,0x55];
var byteAt = function(addr){return RAM[addr];};
var byteTo = function(addr,v){RAM[addr] = v;};

test( "Reset", function() {
	CPU6809.init(byteTo,byteAt,null);
	var s = (CPU6809.status());
	equal(s.dp,0,"Reset");
});

test( "Flags", function() {
	RAM = [0x1D];
	CPU6809.init(byteTo,byteAt,null);
	CPU6809.set("flags",0xff);
	var s = (CPU6809.status());
	equal(s.flags,0xFF,"Flags");
});


test( "Simple op", function() {
	RAM = [0,2,0x55];
	CPU6809.init(byteTo,byteAt,null);
	CPU6809.set("pc",0);
	CPU6809.steps(1);
	var s = (CPU6809.status());
	equal(s.pc,2,"PC");
	equal(RAM[2],171,"Operation");
	equal(s.flags & 0x0F,0x09,"Flags NC");
	equal(CPU6809.T(),6,"Timer");

});
test( "Simple op - extended", function() {
	RAM = [0x70,0,3,0x55];
	CPU6809.init(byteTo,byteAt,null);
	CPU6809.set("pc",0);
	CPU6809.steps(1);
	var s = (CPU6809.status());
	equal(s.pc,3,"PC");
	equal(RAM[3],171,"Operation");
	equal(s.flags & 0x0F,0x09,"Flags NC");
	equal(CPU6809.T(),7,"Timer");

});

test( "Simple op 2", function() {
	RAM = [4,2,0xAB];
	CPU6809.init(byteTo,byteAt,null);
	CPU6809.set("pc",0);
	CPU6809.steps(1);
	var s = (CPU6809.status());
	equal(s.pc,2,"PC");
	equal(RAM[2],0x55,"Operation");
	equal(s.flags & 0x0D,0x01,"Flags C");
	equal(CPU6809.T(),6,"Timer");

});
test( "SEX", function() {
	RAM = [0x1D];
	CPU6809.init(byteTo,byteAt,null);
	CPU6809.set("b",0xAA);
	CPU6809.set("flags",0xff);
	CPU6809.set("pc",0);
	CPU6809.steps(1);
	var s = (CPU6809.status());
	equal(s.pc,1,"PC");
	equal(s.a,0xff,"A");
	//equal(RAM[2],0x55,"Operation");
	equal(s.flags & 0x0F,0x09,"Flags C");
	equal(CPU6809.T(),2,"Timer");

});
test( "EXG", function() {
	RAM = [0x1E, 0x89];
	CPU6809.init(byteTo,byteAt,null);
	CPU6809.set("a",0xAA);
	CPU6809.set("b",0x55);
	CPU6809.set("pc",0);
	CPU6809.steps(1);
	var s = (CPU6809.status());
	equal(s.pc,2,"PC");
	equal(s.a,0x55,"A");
	equal(s.b,0xAA,"A");
	//equal(RAM[2],0x55,"Operation");
	equal(CPU6809.T(),8,"Timer");

});
test( "TFR", function() {
	RAM = [0x1F, 0x89];
	CPU6809.init(byteTo,byteAt,null);
	CPU6809.set("a",0xAA);
	CPU6809.set("b",0x55);
	CPU6809.set("pc",0);
	CPU6809.steps(1);
	var s = (CPU6809.status());
	equal(s.pc,2,"PC");
	equal(s.a,0xAA,"A");
	equal(s.b,0xAA,"A");
	//equal(RAM[2],0x55,"Operation");
	equal(CPU6809.T(),6,"Timer");

});

test( "LEAX ,s++", function() {
	RAM = [0x30, 0xe1];
	CPU6809.init(byteTo,byteAt,null);
	CPU6809.set("sp",120);
	CPU6809.set("pc",0);
	CPU6809.steps(1);
	var s = (CPU6809.status());
	//console.log(s);
	equal(s.pc,2,"PC");
	equal(s.sp,122,"SP");
	equal(s.x,120,"X");
	//equal(RAM[2],0x55,"Operation");
	equal(CPU6809.T(),7,"Timer");

});


module("Simple BRA tests");

test( "BRA - relative addr 1", function() {
	RAM = [0x20,0xfe];
	CPU6809.init(byteTo,byteAt,null);
	CPU6809.set("pc",0);
	CPU6809.steps(1);
	var s = (CPU6809.status());
	equal(s.pc,0,"PC");
	//equal(s.flags & 0x0D,0x01,"Flags C");
	equal(CPU6809.T(),3,"Timer");

});

test( "LBRA - relative addr 1", function() {
	RAM = [0x16,0xff,0xfd];
	CPU6809.init(byteTo,byteAt,null);
	CPU6809.set("pc",0);
	CPU6809.steps(1);
	var s = (CPU6809.status());
	equal(s.pc,0,"PC");
	//equal(s.flags & 0x0D,0x01,"Flags C");
	equal(CPU6809.T(),5,"Timer");

});
test( "LBRA - relative addr 0", function() {
	RAM = [0x16,0x00,0x00];
	CPU6809.init(byteTo,byteAt,null);
	CPU6809.set("pc",0);
	CPU6809.steps(1);
	var s = (CPU6809.status());
	equal(s.pc,3,"PC");
	//equal(s.flags & 0x0D,0x01,"Flags C");
	equal(CPU6809.T(),5,"Timer");
});

test( "LBSR - relative addr 1", function() {
	RAM = [0x17,0xff,0xfd];
	CPU6809.init(byteTo,byteAt,null);
	CPU6809.set("SP",0x0006);
	CPU6809.set("pc",0);
	CPU6809.steps(1);
	var s = (CPU6809.status());
	equal(RAM[4]*256+RAM[5],3,"Stack push");
	equal(s.pc,0,"PC");
	//equal(s.flags & 0x0D,0x01,"Flags C");
	equal(CPU6809.T(),9,"Timer");

});
test( "LBSR - relative addr 0", function() {
	RAM = [0x17,0x0,0x0];
	CPU6809.init(byteTo,byteAt,null);
	CPU6809.set("SP",0x0006);
	CPU6809.set("pc",0);
	CPU6809.steps(1);
	var s = (CPU6809.status());
	equal(RAM[4]*256+RAM[5],3,"Stack push");
	equal(s.pc,3,"PC");
	//equal(s.flags & 0x0D,0x01,"Flags C");
	equal(CPU6809.T(),9,"Timer");

});

module("Push / pop");

test( "PSHS", function() {
	RAM = [0x34, 0x06];
	CPU6809.init(byteTo,byteAt,null);
	CPU6809.set("SP",0x0006);
	CPU6809.set("a",0xAA);
	CPU6809.set("b",0x55);	
	CPU6809.set("pc",0);
	CPU6809.steps(1);
	var s = (CPU6809.status());
	equal(RAM[4],0xaa,"Stack push");
	equal(RAM[5],0x55,"Stack push");
	equal(s.pc,2,"PC");
	equal(s.sp,4,"SP");
	//equal(s.flags & 0x0D,0x01,"Flags C");
	equal(CPU6809.T(),7,"Timer");

});
test( "PULS", function() {
	RAM = [0x35, 0x06,0,0,0xaa,0x55];
	CPU6809.init(byteTo,byteAt,null);
	CPU6809.set("SP",0x0004);
	CPU6809.set("a",0x00);
	CPU6809.set("b",0x00);
	CPU6809.set("pc",0);
	CPU6809.steps(1);
	var s = (CPU6809.status());
	equal(s.a,0xaa,"Reg A");
	equal(s.b,0x55,"Reg B");
	equal(s.pc,2,"PC");
	equal(s.sp,6,"SP");
	//equal(s.flags & 0x0D,0x01,"Flags C");
	equal(CPU6809.T(),7,"Timer");

});

module("Extended opcodes");

test( "LDY imm", function() {
	RAM = [0x10,0x8e, 0x12, 0x34];
	CPU6809.init(byteTo,byteAt,null);
	CPU6809.set("pc",0);
	CPU6809.steps(1);
	var s = (CPU6809.status());
	equal(s.pc,4,"PC");
	equal(s.y,0x1234,"Y reg");
	equal(CPU6809.T(),4,"Timer");

});

test( "LDY extended", function() {
	RAM = [0x10,0xbe, 0x00, 0x01];
	CPU6809.init(byteTo,byteAt,null);
	CPU6809.set("pc",0);
	CPU6809.steps(1);
	var s = (CPU6809.status());
	equal(s.pc,4,"PC");
	equal(s.y,0xbe00,"Y reg");
	equal(s.flags & 0x0E,0x08,"Flags Nzv");
	equal(CPU6809.T(),7,"Timer");

});




module("Disassembler");

test("simple instruction", function(){
	var d = CPU6809.disasm(0x12, 0x80,0x5c,0,0,0xdc84);
	equal (d[0],"NOP");
	equal (d[1],1);
});
test("illegal instruction", function(){
	var d = CPU6809.disasm(0x01, 0x80,0x5c,0,0,0xdc84);
	equal (d[0],"???");
	equal (d[1],1);
});


test("simple instruction + postbyte", function(){
	var d = CPU6809.disasm(0xa7, 0x80,0x5c,0,0,0xdc84);
	equal (d[0],"STA ,X+");
	equal (d[1],2);
});

test("EXG postbyte", function(){
	var d = CPU6809.disasm(0x1e, 0x31,0x00,0x83,0,0xdc84);
	equal (d[0],"EXG U,X");
	equal (d[1],2);
});
test("TFR postbyte", function(){
	var d = CPU6809.disasm(0x1f, 0x14,0x00,0x83,0,0xdc84);
	equal (d[0],"TFR X,S");
	equal (d[1],2);
});
test("PULS", function(){
	var d = CPU6809.disasm(0x35, 0x96,0xe5,0x10,0,0xdc84);
	equal (d[0],"PULS A,B,X,PC");
	equal (d[1],2);
});


test("Prefixed 0x11", function(){
	var d = CPU6809.disasm(0x11, 0x83,0xe5,0x10,0,0xdc84);
	equal (d[0],"CMPU #$E510");
	equal (d[1],4);
});
test("Prefixed 0x11, indexed", function(){
	var d = CPU6809.disasm(0x11, 0xA3,0x81,0x10,0,0xdc84);
	equal (d[0],"CMPU ,X++");
	equal (d[1],3);
});
test("Prefixed 0x11, indexed, indirect", function(){
	var d = CPU6809.disasm(0x11, 0xA3,0x93,0x10,0,0xdc84);
	equal (d[0],"CMPU [,--X]");
	equal (d[1],3);
});
test("Prefixed 0x11, indexed, offset 8", function(){
	var d = CPU6809.disasm(0x11, 0xA3,0xA8,0x10,0,0xdc84);
	equal (d[0],"CMPU 16,Y");
	equal (d[1],4);
});
test("Prefixed 0x11, indexed, negative offset 8", function(){
	var d = CPU6809.disasm(0x11, 0xA3,0xA8,0x80,0,0xdc84);
	equal (d[0],"CMPU -128,Y");
	equal (d[1],4);
});
test("Prefixed 0x11, indexed, offset 16+PC", function(){
	var d = CPU6809.disasm(0x11, 0xA3,0x8D,0x02,0x08,0xdc84);
	equal (d[0],"CMPU 520,PC");
	equal (d[1],5);
});

