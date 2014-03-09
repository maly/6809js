6809js
======

An JavaScript emulation of Motorola 6809 CPU

Used in all emulations at [ASM80 online IDE](http://www.asm80.com)

You can use 6809js also as Node.js or AMD module.

Usage
-----

(a.k.a. The API)

- *window.CPU6809* - main object (instantiated at the start - it shall change)
- *CPU6809.init(memoryTo,memoryAt,ticker)* - Initializes the whole system. All parameters are callback functions for port / memory access:
	- memoryTo(addr,value) - store byte to given address
	- memoryAt(addr) - read byte from given address
	- ticker(T) - unused now. For future use
- *CPU6809.T()* - returns clock ticks count from last init (or reset)
- *CPU6809.reset()* - does a CPU reset
- *CPU6809.set(register, value)* - sets internal register (named PC, A, B, C, D, E, H, L, F, SP) to a given value 
- *CPU6809.status()* - Returns a object {pc, a, b, c, d, e, h, l, f, sp} with actual state of internal registers
- *CPU6809.steps(N)* - Execute instructions as real CPU, which takes "no less than N" clock ticks.

Disassembler:

*NOT YET READY*

Tests
-----

6809js is slightly tested with qUnit - just a basic functionality at this moment

Roadmap
-------

- full interrupts support
- full CWAI emulation
- HD6309 extended mode