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


/*
asyncTest ("Transmit a byte", function() {
	tst= new CPU6809();
	tst.setControl(0x10);
	var status = tst.getStatus();
	equal(status & 0x02, 0x02, "TDRE empty");
	tst.hook('transmit',function(tx){
		var status = tst.getStatus();
		equal(status & 0x02, 0x00, "TDRE full")	;

		equal(tx, 10, "Transmission");
		start();
	});
	tst.setData(10);
});


test( "Reset", function() {
		var tst= new CPU6809();
		tst.setControl(0x10);
		tst.receive(0x55);
		tst.reset();
	    notEqual( tst.getData(), 0x55, "Reset" );
});

test( "Receive and overrun", function() {
	var tst= new CPU6809();
	tst.setControl(0x10);
	tst.receive(0x55);
	tst.receive(0xaa);
	var status = tst.getStatus();
	equal(status & 0x01, 0x01, "RDRF set");
	equal(status & 0x20, 0x20, "OVRN set");
    equal( tst.getData(), 0x55, "Data received" );
    status = tst.getStatus();
    equal(status & 0x01, 0x00, "RDRF reset");
	equal(status & 0x20, 0x00, "OVRN reset");
});

*/
/*
module("Simple init tests");

test ("Clear storage", function() {
	ok(FS.clear(), "FS.clear() goes well");
	equal(FS.filesCount(),0,"Files count is 0");
});

module("Simple file manipulations");

test ("File save", function() {
	FS.clear();
	ok(FS.save('foo', 'bar'), "File saved");
	equal(FS.filesCount(),1,"Files count is 1 now");
	notEqual(FS.dir().indexOf('foo'),-1,"File 'foo' is in listing");
});

test ("File save - dir() test", function() {
	FS.clear();
	FS.save('foo', 'bar');
	deepEqual(FS.dir(),['foo'],"File 'foo' is in dir list");
});


test ("Two files saved", function() {
	FS.clear();
	ok(FS.save('foo', 'bar'), "File foo saved");
	ok(FS.save('bar', 'bar'), "File bar saved");
	equal(FS.filesCount(),2,"Files count is 2 now");
});


test ("Same file saved twice", function() {
	FS.clear();
	ok(FS.save('foo', 'bar'), "File saved");
	ok(FS.save('foo', 'baz'), "File saved second time");
	equal(FS.filesCount(),1,"Files count is 1 now");
});

test ("File read", function() {
	FS.clear();
	ok(FS.save('foo', 'bar'), "File saved");
	equal(FS.load('foo'),'bar',"File contents is 'bar'");
});
test ("File with unicode characters", function() {
	FS.clear();
	ok(FS.save('foo', 'ěščřžýáíé Příšerně žluťoučký kůň'), "File saved");
	equal(FS.load('foo'),'ěščřžýáíé Příšerně žluťoučký kůň',"File contents is 'bar'");
});
test ("Non-exist file read", function() {
	FS.clear();
	ok(FS.save('foo', 'bar'), "File saved");
	equal(FS.load('foox'),null,"File name 'foox' doesn't exist");
});
test ("File save-read-change-read", function() {
	FS.clear();
	ok(FS.save('foo', 'bar'), "File saved");
	equal(FS.load('foo'),'bar',"File contents is 'bar'");
	ok(FS.save('foo', 'baz'), "File changed");
	equal(FS.load('foo'),'baz',"File contents is 'baz' - changed");
});
test ("File remove", function() {
	FS.clear();
	ok(FS.save('foo', 'bar'), "File saved");
	equal(FS.load('foo'),'bar',"File contents is 'bar'");
	ok(FS.rm('foo'), "File removed");
	equal(FS.load('foo'),null,"File deleted sucessfully");
	equal(FS.dir().indexOf('foo'),-1,"File 'foo' isn't in listing");
});
test ("Non-exists file remove", function() {
	FS.clear();
	equal(FS.load('foo'),null,"File doesn't exist");
	equal(FS.rm('foo'), null, "File couldn't be removed, it doesn't exist");
});
test ("File remove must clean localStorage", function() {
	FS.clear();
	FS.save('foo', 'bar');
	ok(FS.rm('foo'), "File removed");
	equal(localStorage['foo'],null,"File removed from localStorage");
});
test ("Specific file remove", function() {
	FS.clear();
	ok(FS.save('foo1', 'bar1'), "File 1 saved");
	ok(FS.save('foo2', 'bar2'), "File 2 saved");
	ok(FS.rm('foo1'), "File 1 removed");
	equal(FS.load('foo1'),null,"File 1 deleted sucessfully");
	equal(FS.load('foo2'),"bar2","File 2 remains intact");
	equal(FS.dir().indexOf('foo1'),-1,"File 1 isn't in listing");
	deepEqual(FS.dir(),["foo2"],"File 2 is in listing");
});

test ("Crazy file names", function() {
	FS.clear();
	ok(FS.save('foo1', 'bar1'), "File 1 saved");
	ok(FS.save('dir/foo1', 'bar2'), "File 2 saved");
	ok(FS.save('dir/foo2', 'bar3'), "File 3 saved");
	ok(FS.save('dir2/foo', 'bar4'), "File 4 saved");
	equal(FS.load('foo1'),"bar1","File 1");
	equal(FS.load('dir/foo1'),"bar2","File 2");
	equal(FS.load('dir/foo2'),"bar3","File 3");
	equal(FS.load('dir2/foo'),"bar4","File 4");
});

module("Directory manipulation", {
	setup: function () {
		FS.clear();
		FS.save('foo1', 'bar1');
		FS.save('dir/foo1', 'bar2');
		FS.save('dir/foo2', 'bar3');
		FS.save('dir2/foo', 'bar4');
		FS.save('dir3/subdir/foox', 'bar5');
	}
});

test ("Simple directory structure", function() {
	deepEqual(FS.dir('dir2'),['foo'], "file 'foo' in directory 'dir2'");
	deepEqual(FS.dir('dir'),['foo1','foo2'], "files 'foo1' and 'foo2' in directory 'dir'");
});

test ("Working directory", function() {
	equal(FS.pwd(),'/', "WD is /");
});

test ("Working directory change", function() {
	ok(FS.cd("dir"), "cd dir");
	equal(FS.pwd(),'/dir/', "WD is /dir/");
	ok(FS.cd("/"), "cd /");
	equal(FS.pwd(),'/', "WD is / now");
});
test ("Working directory deep change", function() {
	ok(FS.cd("dir3"), "cd dir3");
	equal(FS.pwd(),'/dir3/', "WD is /dir3/");
	ok(FS.cd("subdir"), "cd subdir");
	equal(FS.pwd(),'/dir3/subdir/', "WD is /dir3/subdir");
	ok(FS.cd("/"), "cd /");
	equal(FS.pwd(),'/', "WD is / now");
});
test ("Working directory change + ls", function() {
	ok(FS.cd("dir2"), "cd dir");
	equal(FS.pwd(),'/dir2/', "WD is /dir2/");
	deepEqual(FS.dir(),['foo'], "file 'foo' in directory 'dir2'");
});
test ("Working directory change with ..", function() {
	ok(FS.cd("dir"), "cd dir");
	equal(FS.pwd(),'/dir/', "WD is /dir/");
	ok(FS.cd(".."), "cd ..");
	equal(FS.pwd(),'/', "WD is / now");
});
test ("Working directory deep change with ..", function() {
	FS.cd("/dir3/subdir");
	equal(FS.pwd(),'/dir3/subdir/', "WD is /dir3/subdir");
	ok(FS.cd(".."), "cd ..");
	equal(FS.pwd(),'/dir3/', "WD is /dir3/");
	ok(FS.cd(".."), "cd ..");
	equal(FS.pwd(),'/', "WD is / now");
	FS.cd("/dir3/subdir");
	equal(FS.pwd(),'/dir3/subdir/', "WD is /dir3/subdir");
	ok(FS.cd("../.."), "cd ../..");
	equal(FS.pwd(),'/', "WD is / again");
});
test ("getSubdirs()", function() {
	ok(FS.cd("dir"), "cd dir");
	equal(FS.pwd(),'/dir/', "WD is /dir/");
	ok(FS.cd(".."), "cd ..");
	equal(FS.pwd(),'/', "WD is / now");
});

module("Backup and restore tests", {
	setup: function () {
		FS.clear();
		FS.save('foo1', 'bar1');
		FS.save('dir/foo1', 'bar2');
		FS.save('dir/foo2', 'bar3');
		FS.save('dir2/foo', 'bar4');
		FS.save('dir3/subdir/foox', 'bar5');
	}
});

test("backup", function() {
	ok(FS.backup(), "Backup works");
});

test("restore", function() {
	var bak = FS.backup();
	FS.clear();
	ok(FS.restore(bak), "Restore works");
});

test ("Files restored", function() {
	var bak = FS.backup();
	FS.clear();
	FS.restore(bak);
	equal(FS.load('foo1'),'bar1',"File contents is 'bar'");
});


module("Backup and restore with ZIP", {
	setup: function () {
		FS.clear();
		FS.save('foo1', 'bar1');
		FS.save('dir/foo1', 'bar2');
		FS.save('dir/foo2', 'bar3');
		FS.save('dir2/foo', 'bar4');
		FS.save('dir3/subdir/foox', 'bar5');
	}
});

test("backup", function() {
	ok(FS.zip(), "ZIP works");
});

test("restore", function() {
	var bak = FS.zip();
	FS.clear();
	ok(FS.unzip(bak), "Restore works");
});

test ("Files restored", function() {
	var bak = FS.zip();
	FS.clear();
	FS.unzip(bak);
	equal(FS.load('foo1'),'bar1',"File contents is 'bar'");
});


module("Change hooks", {
	setup: function () {
		FS.clear();
	},
});

asyncTest("Hook change handler", function() {
	FS.onChange(function(){ok(true, "Hook on save");FS.onChange(null);start();});
	FS.save("foo","bar");
});
*/